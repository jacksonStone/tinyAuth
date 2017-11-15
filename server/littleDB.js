const path = require("path");
const fs = require("fs");
const normalizedPath = path.join(__dirname, "../pseudoDB");
const tableData = {};
const hasChanged = {};
console.log(tableNames);
console.log(getTablePath(tableNames[0]));

function getRecord(tableName, index){
	const table = getTable(tableName);
	return table[index];
}

function scanTableIntoMemory(tableName) {
	return JSON.parse(fs.readFileSync(getTablePath(tableName)));
}

function setRecord(tableName, index, data){
	const table = getTable(tableName);
	if(data === undefined) {
		delete table[index];
	}
	table[index] = data;
	hasChanged[tableName] = true;
}

function getTablePath(tableName) {
	return path.join(normalizedPath, "/" + tableName)
}

function getTable(tableName) {
	if(!tableData[tableName]) throw 'Invalid Table Name';
	return tableData[tableName];
}

function initializeAllTables() {
	for(let i in tableNames) {
		let name = tableNames[i];
		tableData[name] = scanTableIntoMemory(name)
	}
}

function saveData(){
	for(let i in tableNames) {
		let name = tableNames[i];
		if(hasChanged[name]) {
			fs.writeFile(getTablePath(name), JSON.stringify(tableData[name]), (err)=>{
				if(!err) {
					hasChanged[name] = false;
				}
			})
		}
	}
}

initializeAllTables();
//Every 5 seconds, backup DB to persistent file
setInterval(saveData, 5000);

exports.getRecord = getRecord;
exports.setRecord = setRecord;


