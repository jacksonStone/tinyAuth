controllers = require('./controllers');
const routeMapping = {};
//Form mapping
for(let i in controllers) {
	let c = controllers[i];
	let key = ((c.method || 'get')).toLowerCase() + ' ' + c.url.toLowerCase();
	if(routeMapping[key]) throw "Duplicated Path: " + key;
	routeMapping[key] = c.handler;
}

//Gets the handler we are looking for, based on the url and method we pass in
function getHandler(req) {
	let method = req.method.toLowerCase();
	//Only posts, please.
	if(method === 'put') method = 'post'
	return routeMapping[method + ' ' + req.url.toLowerCase()];
}

exports.getHandler = getHandler;
