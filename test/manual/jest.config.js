'use strict';

const base = require('../jest.config.js');

module.exports = {
	...base,
	testMatch: [
		`<rootDir>*.(spec|test).(js|ts)`,
	]
};
