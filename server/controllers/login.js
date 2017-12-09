const { hashPassword, encrypt } = require('../utilities/cryptoStuff');
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
		return handleSuccessfulLogin(user);
	}

	throwError('Bad Password!');

}

function throwError(errMessage){
	throw new Error(errMessage || 'Must have username and password included in body');
}

function handleSuccessfulLogin(user) {
	var userCookie = {
		username:user.username,
		created: Date.now()
	};
	var encryptedCookied = encrypt(JSON.stringify(userCookie));
	return {
		headers: {'Set-Cookie':'tinyauth='+encryptedCookied+'; HttpOnly; Expires=Wed, 21 Oct 2030 07:28:00 GMT'},
		body: 'ok',
	};
}

module.exports = {
	url:'/login',
	method:'post',
	handler:login,
	headers:true,
}