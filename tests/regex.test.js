const { handlerRegex } = require('../regexes');

describe("regex", () => {
	test('qualifies for GET', () => {
		const methodDefinition = 'export function GET(request: NextRequest, response?: NextResponse)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for async GET', () => {
		const methodDefinition = 'export async function GET(request: NextRequest, response?: NextResponse)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for POST', () => {
		const methodDefinition = 'export function POST(request: NextRequest, response?: NextResponse)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for ANY', () => {
		const methodDefinition = 'export function OPTION(request: NextRequest, response: NextResponse)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for ANY with just a request', () => {
		const methodDefinition = 'export function OPTION(request: NextRequest)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for ANY with just a response', () => {
		const methodDefinition = 'export function OPTION(response: NextResponse)';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
	test('qualifies for ANY with no params', () => {
		const methodDefinition = 'export function OPTION()';
		const expected = 'export async function handler(event, context)';

		const actual = methodDefinition.replace(handlerRegex, expected);

		expect(actual).toBe(expected);
	});
});