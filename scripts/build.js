const { execSync } = require('child_process');
const fs = require('fs');
const archiver = require('archiver');

function exec(command) {
    console.log(`\nRunning \`${command}\``);
    return execSync(command).toString();
}

// const stashOutput = exec("git stash save --include-untracked");
// const stashed = !stashOutput.match(/No local changes to save/);
// const branch = exec("git rev-parse --abbrev-ref HEAD").trim();
// exec("git checkout main");

try {
    const { version } = require('../package.json');
    const releasesDir = "releases";
    
    if (!fs.existsSync(releasesDir)){
        fs.mkdirSync(releasesDir);
    }

    // Build the project
    exec("npm run build");

    const packageFile = `${releasesDir}/text-tracker-extension-${version.replace(/\./g, '_')}.zip`;
    const output = fs.createWriteStream(packageFile);
    const archive = archiver('zip');

    output.on('close', function () {
        console.log(`\nPackage file zipped and saved at '${packageFile}'`);
    });

    archive.on('warning', (err) => { throw err; });
    archive.on('error', (err) => { throw err; });

    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
} finally {
    // exec(`git checkout ${branch}`);
    // if (stashed) exec("git stash pop");
} 