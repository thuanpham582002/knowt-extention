const readline = require('readline-sync');
const { execSync } = require('child_process');
const { replaceInFileSync } = require('replace-in-file');

function exec(command) {
    console.log(`\nRunning \`${command}\``);
    return execSync(command).toString();
}

function bumpVersion(version, releaseType) {
    let [major, minor, patch] = version.split('.');
    switch (releaseType) {
        case "major":
            major = (parseInt(major, 10) + 1).toString();
            minor = "0";
            patch = "0";
            break;
        case "minor":
            minor = (parseInt(minor, 10) + 1).toString();
            patch = "0";
            break;
        case "patch":
            patch = (parseInt(patch, 10) + 1).toString();
            break;
    }
    return [major, minor, patch].join('.');
}

const releaseType = readline.question("What type of release is this? (major | minor | patch) ").toLowerCase();

if (!["major", "minor", "patch"].includes(releaseType)) {
    console.log(`\nInvalid release type '${releaseType}'`);
    process.exit(1);
}

const stashOutput = exec("git stash save --include-untracked");
const stashed = !stashOutput.match(/No local changes to save/);
const branch = exec("git rev-parse --abbrev-ref HEAD").trim();
exec("git checkout main");

try {
    const { version } = require('../package.json');
    const newVersion = bumpVersion(version, releaseType);
    
    replaceInFileSync({
        files: [
            "package.json",
            "public/manifest.json",
            "dist/manifest.json"
        ],
        from: `"version": "${version}"`,
        to: `"version": "${newVersion}"`,
    });

    exec("git add -A");
    exec(`git commit -m \"Release version ${newVersion}\"`);
    const tag = `v${newVersion}`;
    exec(`git tag -a ${tag} -m "Version ${newVersion}" -f`);
    exec("git push --follow-tags");

    exec(`git push origin ${tag} && git push origin main`);
} catch (e) {
    console.log('Error! Reverting changes and returning to original git state');
    exec('git reset --hard');
    throw e;
} finally {
    exec(`git checkout ${branch}`);
    if (stashed) exec("git stash pop");
} 