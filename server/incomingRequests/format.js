
var Promise = require("bluebird")

function initial(req){
	const fullUrl = req.url;
	const method = req.method.toLowerCase();
	const parsedURL = parseURL(fullUrl);
	const url = parsedURL.url;
	const parameters = parsedURL.parameters;
	console.log({url, parameters, method});
	return {url, parameters, method};
}

function attachBody(req, formattedRequest) {
	return waitOnBody(req)
		.then(body => {
			formattedRequest.body = body;
		});
}

//Private

function waitOnBody(request) {
	return new Promise((resolve, reject) => {
	  let body = [];
	  request.on('error', (err) => {
	    console.error(err);
	    reject(err);
	  }).on('data', (chunk) => {
	    body.push(chunk);
	  }).on('end', () => {
	  	if(!body.length) {
	  		resolve();
	  	}
	  	body = Buffer.concat(body);
	    try {
	    	body = JSON.parse(body.toString());
	    	resolve(body);
	    } catch(e) {
	    	//Not JSON, accept anyway
	    	resolve(body);
	    }
	  });
	})
}


function parseURL(url) {
	const parameters = {};
	
	if(url.indexOf('?') === -1) return { parameters, url };

	const parts = getBeforeAndAfter(url, '?');
	const rootURL = parts[0]
	if(!parts[1]) return { parameters, url: rootURL };

	const queryParts = parts[1].split('&');

	for(let i in queryParts) {
		let part = queryParts[i];
		let keyAndValue = getBeforeAndAfter(part, '=');
		if(keyAndValue[0] && keyAndValue[1]) {
			parameters[keyAndValue[0]] = keyAndValue[1];
		}
	}

	return { parameters, url:rootURL };
}

function getBeforeAndAfter(str, target) {
	if(str.indexOf(target) === -1) return [str, ''];
	const post = str.substring(str.indexOf(target)+1);
	const pre = str.substring(0, str.indexOf(target));
	return [pre, post];
}



module.exports = { initial, attachBody };