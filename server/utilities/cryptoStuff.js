const uuidV4 = require('uuid/v4');
const crypto = require('crypto');
const HASHING_FUNCTION_NAME = 'sha256';
const ENCRYPTION_FUNCTION_NAME = 'aes-128-cbc';
const { keys } = require('keykeeper');
const HMAC_KEY = keys.hmackey.slice(0,16);
const ENCRYPTION_PASSWORD = keys.encryption.slice(0,16);
const EXPIRATION = 60 * 60 * 24 * 7;

function getSalt(){
  return uuidV4();
}

function hashPassword(password, salt){
  return hashValues(password, salt);
}

function getHMAC(encryptedText, nonce) {
	return hashValues(encryptedText+nonce, HMAC_KEY);
}

function hashValues(val1, val2) {
	const hashFunction = crypto.createHash(HASHING_FUNCTION_NAME);
  return hashFunction.update(val1+val2).digest('base64');
}

function getNonce(){
	const iv = new Buffer(crypto.randomBytes(16))
  return iv.toString('hex').slice(0, 16);
}

function encrypt(text){
	const nonce = getNonce();
	const cipher = crypto.createCipheriv(ENCRYPTION_FUNCTION_NAME,ENCRYPTION_PASSWORD,nonce)
	cipher.setEncoding('hex');
	cipher.write(text);
	cipher.end();
	const crypted = cipher.read();
	const hmac = getHMAC(crypted, nonce);
  return [nonce,crypted,hmac].join(':');
}
 
function decrypt(text){
	const parts = text.split(':');
	const nonce = parts[0];
	const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv(ENCRYPTION_FUNCTION_NAME,ENCRYPTION_PASSWORD,nonce)
  let dec = decipher.update(encryptedText,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function verifyBodyWithHMAC(encryptionBody) {
	const parts = encryptionBody.split(':');
	if(parts.length < 3) return false;
	const nonce = parts[0];
	const encryptedText = parts[1];
	const hmac = parts[2];
	const newHMAC = getHMAC(actualText, nonce);
	return hmac === newHMAC;
}

function decryptCookie(cookie, callback) {
	const parts = text.split(':');
	const hasIntegrity = verifyBodyWithHMAC(cookie);
	if (hasIntegrity) {
		return decrypt(cookie);
	}
	throw new Error('Content integrity compromised');
}

function grabCookieContent(cookieHeader) {
	const cookies = cookieHeader.split('; ');
	for(let i in cookies) {
		const cookie = cookies[i];
		const keyValuePair = getBeforeAndAfter(cookie, '=');
		const key = keyValuePair[0];
		const value = keyValuePair[1];
		if(key==='tinyauth') return value;
	}
}

function getBeforeAndAfter(str, target) {
	if(str.indexOf(target) === -1) return [str, ''];
	const post = str.substring(str.indexOf(target)+1);
	const pre = str.substring(0, str.indexOf(target));
	return [pre, post];
}


function getUser(formattedRequest) {
	const headers = formattedRequest.headers;
	if(!headers.cookie) {
		return;
	}
	const cookieContent = grabCookieContent(headers.cookie);
	if(!cookieContent) {
		return;
	}
	try {
		const decrypted = decrypt(cookieContent);
		const body = JSON.parse(decrypted);
		if(body.created) {
			//See if expired
			const born = body.created;
			const present = Date.now();
			if(present - born < EXPIRATION) {
				return body.username;
			}
		}
	}
	catch(e) {
		return;
	}
}


module.exports = {
	getSalt,
	encrypt,
	decrypt,
	getUser,
	hashPassword
}