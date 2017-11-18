const { hashPassword } = require('../utilities/cryptoStuff');
const tableName = 'users';
const db = require('../littleDB');

function login(formattedRequest) {
	if(!formattedRequest.body) throwError();
	const username = formattedRequest.body.username;
	const unHashedPassword = formattedRequest.body.password;
	if(!username || !unHashedPassword) throwError();

	console.log(formattedRequest);

	const user = db.getRecord('users', username)
	if(!user) throwError('User does not exist');

	const hashedPassword = user.password;

	if(hashedPassword === hashPassword(unHashedPassword, user.salt)) {
		return 'Correct!';
	}

	throwError('Bad Password!');

}

function throwError(errMessage){
	throw new Error(errMessage || 'Must have username and password included in body');
}

module.exports = {
	url:'/login',
	method:'post',
	handler: login
}