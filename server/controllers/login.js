const DB = require('../littleDB');

function login(formattedRequest) {
	console.log(formattedRequest);
	const user = formattedRequest.body.userName;
	return DB.getRecord('users', user);
}

module.exports = {
	url:'/login',
	method:'post',
	handler: login
}