
const { getUser } = require('../utilities/cryptoStuff');

function verifyUser(formattedRequest) {	
	return getUser(formattedRequest);
}

module.exports = {
	url:'/verify-user',
	method:'post',
	handler: verifyUser,
}