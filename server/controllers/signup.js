const db = require('../littleDB');
const tableName = 'users';
const { getSalt, hashPassword } = require('cryptoutils')(require('keykeeper').keys);
const getCookie = require('../utilities/getCookie');


function signup(formattedRequest) {
	if(!formattedRequest.body) throwError();
	const username = formattedRequest.body.username;
	const unHashedPassword = formattedRequest.body.password;
	if(!username || !unHashedPassword) throwError();
	
	if(db.getRecord(tableName, username)) throwError('User exists!');

	const salt = getSalt();
	const hashedPassword = hashPassword(unHashedPassword, salt);


	const newUserRecord = {
		username,
		salt,
		password: hashedPassword
	};

	db.setRecord(tableName, username, newUserRecord);

	return {
		headers: getCookie(username),
		body: 'Ok'
	};
}

function throwError(errMessage){
		throw new Error(errMessage || 'Must have username and password included in body');
}

module.exports = {
	url:'/signup',
	method:'post',
	handler: signup,
	headers: true,
}