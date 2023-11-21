function convertNextResponseToLambdaResponse(nextResponse, additionalHeaders = {}) {
	let body, headers = {}, statusCode = 200;
	
	if (nextResponse && typeof nextResponse === 'object') {
			body = nextResponse.json ? nextResponse.json : {};
			headers = nextResponse.headers ? nextResponse.headers : {};

			if (nextResponse.status) {
					statusCode = nextResponse.status;
			}
	}

	headers = { ...headers, ...additionalHeaders };
	headers['Content-Type'] = headers['Content-Type'] || 'application/json';

	return {
			statusCode,
			headers,
			body: JSON.stringify(body)
	};
}

module.exports = { convertNextResponseToLambdaResponse };