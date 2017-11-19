const Promise = require('bluebird');
const https = require('https');
const http = require('http');
const { keys, devMode } = require('keykeeper');
const { attachBody } = require('formatrequest');

const urlMappings = {
	devMode: {
		"thinPersist":"localhost:5003",
	},
	prodMode: {
		"thinPersist":"somethinghere.com",
	}
};

const httpToUse = devMode ? http : https;
const urlMap = devMode ? urlMappings.devMode : urlMappings.prodMode;

function makeRequest(service, urlPath, headers, body, method) {
	const rootUrl = urlMap[service];
	if(!rootUrl) throw new Error('No service by the name: ' + service);

	const requestObject = getRequestObject(rootUrl);
	requestObject.path = urlPath;
	requestObject.method = (method || 'get').toUpperCase();
	headers = attachKey(headers, service);
	requestObject.headers = headers;
	headers = attachContentLength(headers, body);
	return new Promise((resolve, reject) => {
		request = httpToUse.request(requestObject, (res) => {
			const formattedResponse = {};
			return attachBody(res, formattedResponse)
				.then(()=>{
					console.log("RESPONSE!!!!");
					formattedResponse.headers = res.headers;
					console.log(formattedResponse);
					resolve(formattedResponse);
				})
		});
		request.on('error', e => {
			reject(e);
		});
		if(body) {
			request.write(body);
		}
		request.end();
	});
}


module.exports = makeRequest;

//Private

function attachContentLength(headers, body) {
	if(!body) return;
	if(headers['Content-Length']) return;
	let size;
	try {
		size = Buffer.byteLength(body);
	} catch (e) {
		size = Buffer.byteLength(JSON.stringify(body));
	}
	if(size) {
		headers['Content-Length'] = size;
	}
}
function getRequestObject(rootUrl) {
	if(rootUrl.indexOf(':') !== -1) {
		let urlParts = rootUrl.split(':');
		return { hostname: urlParts[0], port: urlParts[1] }
	}
	return { hostname: rootUrl };
}
function attachKey(headers, serviceName) {
	headers = headers || {};
	console.log(keys);
	if(!keys[serviceName]) throw new Error('No key in .env for: ' + serviceName);
	headers['jasapi'] = keys[serviceName];
	return headers;
}


