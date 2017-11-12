const { getHandler } = require('./trafficControl')
//Because native ES6 is trash
var Promise = require("bluebird")

//This will formate a request object into a minimal form, and handle the flow of
//control to controller handler methods
function root(req, res) {
	const method = req.method;

	const formattedReq = {
		url : req.url,
		method: method
	}

	const handler = getHandler(formattedReq);

	if(!handler) {
		res.writeHead(404); 
		res.end('Invalid Route');
	}
  let body = [];

  return waitOnBody(req)
  	.then(body => {
  		formattedReq.body = body;
  		return handler(formattedReq); 
  	})
  	.then(handlerRes => {
			console.log(handlerRes);
			if(typeof handlerRes === 'object') {
				handlerRes = JSON.stringify(handlerRes);
			}
			res.writeHead(200);
			res.write(handlerRes ||  "Consider it done!");
			res.end();
		})
		.catch(err => {
			res.writeHead(400); 
			res.end(err.message);
		});
}


function waitOnBody(request) {
	return new Promise((resolve, reject) => {
	  let body = [];
	  request.on('error', (err) => {
	    console.error(err);
	    reject(err);
	  }).on('data', (chunk) => {
	    body.push(chunk);
	  }).on('end', () => {
	    body = Buffer.concat(body).toString();
	    try {
	    	body = JSON.parse(body);
	    	resolve(body);
	    } catch(e) {
	    	reject(new Error('Only JSON please'));
	    }
	  });
	})
}


module.exports = {
	root:root
};

