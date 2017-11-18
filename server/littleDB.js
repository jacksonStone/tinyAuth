const path = require("path");
const fs = require("fs");
const thinPersist = require('./externalConnections/thinPersist');

const tableData = {};
const hasChanged = {};
const resourceNamePrefix = 'tinyauth';
const tableNames = ['users'];
const Promise = require('bluebird');

function getRecord(tableName, index){
	const table = getTable(tableName);
	return table[index];
}

function getResourceName(tableName) {
	return resourceNamePrefix + '-' + tableName;
}

function setRecord(tableName, index, data){
	const table = getTable(tableName);
	if(data === undefined) {
		delete table[index];
	}
	table[index] = data;
	hasChanged[tableName] = true;
}

function getTable(tableName) {
	if(!tableData[tableName]) throw 'Invalid Table Name';
	return tableData[tableName];
}

function initializeAllTables() {
	for(let i in tableNames) {
		let name = tableNames[i];
		scanTableIntoMemory(name)
		tableData[name] = scanTableIntoMemory(name)
	}
}

function saveData(){
	for(let i in tableNames) {
		let name = tableNames[i];
		if(hasChanged[name]) {
			
			const dataAsString = JSON.stringify(tableData[name]);
			console.log('Saving: ' + name + '... ');
			hasChanged[name] = false;
			thinPersist.setObject(getResourceName(name), dataAsString).then((res, err) => {
				if(err) {
					console.log('Error Saving: ' + name);
					hasChanged[name] = true;
 				}
			})
		}
	}
}

function fetchTables() {
	return Promise.all(tableNames.map( fetchTable ));
}

function fetchTable(tableName) {
	return thinPersist.getObject(getResourceName(tableName))
		.then(obj => {
			var body = obj.body;
			if(typeof body !== 'object') {
				try {
					body = JSON.parse(body);
				} catch(e) {
					body = {};
				}
			}
			return body;
		});
}

console.log('Initializing Tables...');
fetchTables()
	.then(tables => {
		console.log(tables);
		tableNames.map((tableName, index) => {
			tableData[tableName] = tables[index] || {};
		});
		console.log('Tables Initialized');
	});

//Every 5 seconds, backup DB to persistent file
setInterval(saveData, 5000);

exports.getRecord = getRecord;
exports.setRecord = setRecord;


