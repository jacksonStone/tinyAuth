const uuidV4 = require('uuid/v4');
const crypto = require('crypto');
const HASHING_FUNCTION_NAME = 'sha256';

function getSalt(){
  return uuidV4();
}

function hashPassword(password, salt){
  hashFunction = crypto.createHash(HASHING_FUNCTION_NAME);
  return hashFunction.update(password+salt).digest('base64');
}

module.exports = {
	getSalt,
	hashPassword
}