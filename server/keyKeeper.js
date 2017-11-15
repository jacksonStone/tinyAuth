const fs = require('fs');
const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';
const keys = {};

if(!devMode) {
	keys.awsClient = process.env.awsclient;
	keys.awsSecret = process.env.awssecret;
	keys.myKey = process.env.prodkey;
} else {
	let env = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.env')));
	keys.awsClient =  env.awsclient;
	keys.awsSecret = env.awssecret;
	keys.myKey = env.devkey;
}

exports.keys = keys;
exports.devMode = devMode;