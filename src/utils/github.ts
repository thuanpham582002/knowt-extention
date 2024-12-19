import { VocabularyItem } from '../types/VocabularyItem';

const GITHUB_API_BASE = 'https://api.github.com';

interface GithubConfig {
  githubToken: string;
  enableGithubSync: boolean;
  githubRepoOwner: string;
  githubRepoName: string;
  githubHighlightsPath: string;
}

async function getGithubConfig(): Promise<GithubConfig | null> {
  const config = await chrome.storage.sync.get({
    githubToken: '',
    enableGithubSync: false,
    githubRepoOwner: '',
    githubRepoName: '',
    githubHighlightsPath: 'data/vocabulary.json'
  });

  if (config.enableGithubSync) {
    if (!config.githubToken || !config.githubRepoOwner || !config.githubRepoName) {
      console.error('Missing required GitHub configuration');
      return null;
    }
  }

  return config as GithubConfig;
}

export async function updateGithubFile(content: any): Promise<any> {
  const config = await getGithubConfig();
  if (!config || !config.githubToken) {
    console.warn('No GitHub token available. Aborting updateGithubFile.');
    return;
  }

  try {
    // Get current file (if exists) to get its SHA
    const currentFileResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${config.githubRepoOwner}/${config.githubRepoName}/contents/${config.githubHighlightsPath}`,
      {
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let sha: string | undefined;
    if (currentFileResponse.ok) {
      const currentFile = await currentFileResponse.json();
      sha = currentFile.sha;
    }

    // Prepare content
    const contentString = JSON.stringify(content, null, 2);
    const contentBase64 = btoa(unescape(encodeURIComponent(contentString)));

    // Update or create file
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${config.githubRepoOwner}/${config.githubRepoName}/contents/${config.githubHighlightsPath}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${config.githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update vocabulary list',
          content: contentBase64,
          ...(sha && { sha })
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to sync with GitHub: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GitHub sync failed:', error);
    throw error;
  }
} 