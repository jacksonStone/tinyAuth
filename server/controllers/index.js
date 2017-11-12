const normalizedPath = require("path").join(__dirname, ".");
require("fs").readdirSync(normalizedPath).forEach(function(file) {
	if(file !== "index.js") {
		var name = file.substring(0, file.length - 3);
		exports[name] = require('./'+file);
	}
});
