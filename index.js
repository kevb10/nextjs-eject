const fs = require('fs');
const path = require('path');
const { transformFile } = require('./transform');

// Eject function to transform all route files
function eject(projectDir) {
    const apiDir = path.join(projectDir, 'src', 'app', 'api');
  const lambdasDir = path.join(projectDir, 'src', 'app', 'lambdas');
  fs.renameSync(apiDir, lambdasDir);

  fs.readdirSync(lambdasDir).forEach(dir => {
    const routePath = path.join(lambdasDir, dir, 'route.ts');
        const handlerPath = routePath.replace('route.ts', 'handler.ts');
        fs.renameSync(routePath, handlerPath);
    transformFile(handlerPath);
    });
}

module.exports = { eject };
