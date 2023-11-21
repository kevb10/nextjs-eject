const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Function to transform a file using AST
function transformFile(filePath) {
	const code = fs.readFileSync(filePath, 'utf8');

	// Parse the code into an AST
	const ast = parser.parse(code, {
		sourceType: 'module',
		plugins: ['typescript']
	});

	// Traverse the AST to apply transformations
	traverse(ast, {
		FunctionDeclaration(path) {
			// Replace specific function declarations
			if (path.node.id && ['GET', 'POST', 'OPTION', 'PATCH', 'DELETE'].includes(path.node.id.name)) {
				path.node.id.name = 'handler';
				path.node.async = true; // Ensure the function is async
				path.node.params = [t.identifier('event'), t.identifier('context')]; // Change parameters
			}
		},
		VariableDeclarator(path) {
			if (path.node.id.name === 'body' && path.node.init.type === 'AwaitExpression' &&
				path.node.init.argument.type === 'CallExpression' &&
				path.node.init.argument.callee.object.name === 'request' &&
				path.node.init.argument.callee.property.name === 'json') {

				path.node.init.argument.callee.object.name = 'event';
			}
		},
		VariableDeclaration(path) {
			if (path.node.declarations[0].id.name === 'queryParams' &&
				path.node.declarations[0].init.type === 'MemberExpression' &&
				path.node.declarations[0].init.object.name === 'request' &&
				path.node.declarations[0].init.property.name === 'query') {

				path.node.declarations[0].init.object.name = 'event';
			}
		},
		ReturnStatement(path) {
			// Logic to modify return statements for Lambda format
			if (path.node.argument && path.node.argument.type === 'CallExpression' &&
				path.node.argument.callee.property &&
				path.node.argument.callee.property.name === 'json') {

				let responseBody = path.node.argument.arguments[0];
				let responseOptions = path.node.argument.arguments[1];

				// Create the new return statement for Lambda
				let newReturnStatement = t.returnStatement(
					t.objectExpression([
						t.objectProperty(t.identifier('statusCode'), responseOptions ?
							t.memberExpression(responseOptions, t.identifier('status')) : t.numericLiteral(200)),
						t.objectProperty(t.identifier('headers'), t.objectExpression([
							t.objectProperty(t.stringLiteral('Content-Type'), t.stringLiteral('application/json'))
						])),
						t.objectProperty(t.identifier('body'), t.callExpression(
							t.memberExpression(t.identifier('JSON'), t.identifier('stringify')), [responseBody]))
					])
				);

				path.replaceWith(newReturnStatement);
			}
		}
	});

	// Generate the modified code
	const output = generate(ast, {}, code);
	fs.writeFileSync(filePath, output.code);
}

module.exports = { transformFile };