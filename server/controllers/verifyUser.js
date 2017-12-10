
const { getUser } = require('cryptoutils')(require('keykeeper').keys);

function verifyUser(formattedRequest) {	
	var userName = getUser(formattedRequest);
	if(!userName) throw new Error('Not authenticated');
	return userName;
}

module.exports = {
	url:'/verify-user',
	method:'post',
	handler: verifyUser,
}