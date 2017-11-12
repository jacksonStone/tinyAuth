const DB = require('../littleDB');

function signup(formattedRequest) {
	console.log(formattedRequest);
	if(!formattedRequest.body) throwError();
	const user = formattedRequest.body.username;
	const password = formattedRequest.body.password;
	if(!user || !password) throwError();

	const currentUser = DB.getRecord('users', user);
	if(currentUser) throwError('Already Exists');

	DB.setRecord('users', user, {password: password, salt: '12345'});
}

function throwError(errMessage){
		throw new Error(errMessage || 'Must have username and password included in body');
}

module.exports = {
	url:'/signup',
	method:'post',
	handler: signup
}