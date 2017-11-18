const fs = require('fs');
const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';
let keys = {};

if(!devMode) {

	keys = process.env;

} else {
	let env = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.env')));
	keys = env;
}

exports.keys = keys;
exports.devMode = devMode;