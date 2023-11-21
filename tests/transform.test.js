const fs = require('fs');
const path = require('path');
const { transformFile } = require('../transform');

function createTsFile(content, filePath) {
	fs.writeFileSync(filePath, content, 'utf8');
}


describe('transformFile function', () => {
	describe('POST function is transformed correctly', () => {
		const mockFilePath = path.join(__dirname, 'tempMockFile.ts');
		const mockContent = `
	declare const NextResponse: any;
	declare type NextRequest = {};
export async function POST(request: NextRequest) {
	const body = await request.json();
  return NextResponse.json({ message: 'Hello World' });
}
	`;

		const expectedOutput = `
	declare const NextResponse: any;
	declare type NextRequest = {};
	export async function handler(event, context) {
		const body = await event.json();
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				message: 'Hello World'
			})
		};
	}	
	`;

		beforeAll(() => {
			// Create the TypeScript file
			createTsFile(mockContent, mockFilePath);
		});

		afterAll(() => {
			// Delete the TypeScript file
			if (fs.existsSync(mockFilePath)) {
				fs.unlinkSync(mockFilePath);
			}
		});

		test('transforms TypeScript file correctly', () => {
			// Run your transformation function here
			transformFile(mockFilePath);

			// Read the transformed file
			const transformedContent = fs.readFileSync(mockFilePath, 'utf8');

			// Assert that the transformed content matches the expected output. Ignore whitespace.
			expect(transformedContent.replace(/\s/g, '')).toBe(expectedOutput.replace(/\s/g, ''));
		});
	});
	describe('GET function is transformed correctly', () => {
		const mockFilePath = path.join(__dirname, 'tempMockFile.ts');
		const mockContent = `
	declare const NextResponse: any;
	declare type NextRequest = {};
export async function GET(request: NextRequest) {
	const queryParams = request.query;
  return NextResponse.json({ message: 'Hello World' });
}
	`;

		const expectedOutput = `
	declare const NextResponse: any;
	declare type NextRequest = {};
	export async function handler(event, context) {
		const queryParams = event.query;
		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				message: 'Hello World'
			})
		};
	}	
	`;

		beforeAll(() => {
			// Create the TypeScript file
			createTsFile(mockContent, mockFilePath);
		});

		afterAll(() => {
			// Delete the TypeScript file
			if (fs.existsSync(mockFilePath)) {
				fs.unlinkSync(mockFilePath);
			}
		});

		test('transforms TypeScript file correctly', () => {
			// Run your transformation function here
			transformFile(mockFilePath);

			// Read the transformed file
			const transformedContent = fs.readFileSync(mockFilePath, 'utf8');

			// Assert that the transformed content matches the expected output. Ignore whitespace.
			expect(transformedContent.replace(/\s/g, '')).toBe(expectedOutput.replace(/\s/g, ''));
		});
	});
});
