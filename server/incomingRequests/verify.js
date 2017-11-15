const { keys } = require('../keyKeeper')
const myKey = keys.myKey;

function verify(req) {
	const requestKey = req.headers['jasapi'];
	return requestKey === myKey;
}

module.exports = verify;