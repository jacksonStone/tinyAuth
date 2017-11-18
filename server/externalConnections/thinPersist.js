const makeGenericRequest = require('./makeRequest');

function makeRequest(urlPath, headers, body, method) {
	return makeGenericRequest('thinPersist', ...arguments);
}

function getObject(objectName) {
	return makeRequest('/get-resource?resource='+objectName);
}

function setObject(objectName, body) {
	return makeRequest('/set-resource?resource='+objectName, {}, body, 'post');
}


module.exports = { getObject, setObject };
