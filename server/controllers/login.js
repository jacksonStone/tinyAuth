const { hashPassword, encrypt } = require('cryptoutils')(require('keykeeper').keys);
const getCookie = require('../utilities/getCookie');
const tableName = 'users';
const db = require('../littleDB');

function login(formattedRequest) {
	if(!formattedRequest.body) throwError();
	const username = formattedRequest.body.username;
	const unHashedPassword = formattedRequest.body.password;
	if(!username || !unHashedPassword) throwError();

	const user = db.getRecord('users', username)
	if(!user) throwError('User does not exist');

	const hashedPassword = user.password;

	if(hashedPassword === hashPassword(unHashedPassword, user.salt)) {
		return {
			headers: getCookie(username),
			body: 'Ok'
		};
	}

	throwError('Bad Password!');

}

function throwError(errMessage){
	throw new Error(errMessage || 'Must have username and password included in body');
}



module.exports = {
	url:'/login',
	method:'post',
	handler:login,
	headers:true,
}