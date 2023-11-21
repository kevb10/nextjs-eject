// @ts-ignore
export async function handler(event, context) {
	response.json({ message: 'Hello World' }, headers: {
		'Content-Type': 'application/json',
		});
}