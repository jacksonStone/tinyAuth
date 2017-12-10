const { encrypt } = require('cryptoutils')(require('keykeeper').keys);

function getCookie(username) {
	var userCookie = {
		username: username,
		created: Date.now()
	};
	var encryptedCookied = encrypt(JSON.stringify(userCookie));
	return {'Set-Cookie':'tinyauth='+encryptedCookied+'; HttpOnly; Expires=Wed, 21 Oct 2030 07:28:00 GMT'};
}

module.exports = getCookie;
