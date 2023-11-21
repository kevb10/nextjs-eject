const fs = require('fs');
const path = require('path');
const { handlerRegex } = require('./regexes');

function eject(projectDir) {
    // Get api folder path
    const apiDir = path.join(projectDir, 'src', 'app', 'api');
    // Rename api folder to lambdas
    fs.renameSync(apiDir, path.join(projectDir, 'src', 'app', 'lambdas'));

    // Loop through lambdas folder
    fs.readdirSync(path.join(projectDir, 'src', 'app', 'lambdas')).forEach(dir => {
        // Get route file path
        const routePath = path.join(projectDir, 'src', 'app', 'lambdas', dir, 'route.ts');
        // Rename route.ts to handler.ts  
        const handlerPath = routePath.replace('route.ts', 'handler.ts');
        fs.renameSync(routePath, handlerPath);
        // Rewrite handler contents
        const routeFileContents = fs.readFileSync(handlerPath, 'utf8');

        const handlerContents = routeFileContents
            .replace(handlerRegex, 'export async function handler(event, context)')
            // Replace Next.js response pattern with Lambda response pattern
            .replace(/return NextResponse.json\((.*), \{(.*)\}\);/g, (_, body, headers) => {
                // Capture status code if available
                const statusMatch = /status: (\d+)/.exec(headers);
                const statusCode = statusMatch ? statusMatch[1] : 200;
                return `return convertNextResponseToLambdaResponse(${body}, ${statusCode}, {${headers}});`;
            })
            // Include the conversion function in each handler file
            .concat('\n\n' + convertNextResponseToLambdaResponse.toString());

        // Write new handler content  
        fs.writeFileSync(handlerPath, handlerContents);
    });
}

module.exports = { eject };
