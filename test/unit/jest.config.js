'use strict';

const base = require('../jest.config');

module.exports = {
	...base,
	testMatch: [
		`<rootDir>*.(spec|test).(js|ts)`,
	]
};
