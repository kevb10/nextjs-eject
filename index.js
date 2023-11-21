const fs = require('fs');
const path = require('path');
const { transformFile } = require('./transform');

function processDirectory(directory) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      processDirectory(entryPath); // Recursively process subdirectories
    } else if (entry.isFile() && entry.name === 'route.ts') {
      const handlerPath = entryPath.replace('route.ts', 'handler.ts');
      fs.renameSync(entryPath, handlerPath);
      transformFile(handlerPath);
    }
  });
}

function eject(projectDir = process.cwd()) {
  const possibleRoots = [
    path.join(projectDir, 'src', 'app', 'api'),
    path.join(projectDir, 'app', 'api')
  ];
  console.log(possibleRoots)
  let apiDir;
  for (const root of possibleRoots) {
    if (fs.existsSync(root)) {
      apiDir = root;
      break;
    }
  }

  if (!apiDir) {
    throw new Error('Could not find api directory');
  }

  const lambdasDir = apiDir.replace(/api$/, 'lambdas');
  fs.renameSync(apiDir, lambdasDir);

  processDirectory(lambdasDir); // Process the directory and its subdirectories
}

module.exports = { eject };
