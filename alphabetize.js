#!/usr/bin/env node
// alphabetize.js
// A function for alphabetizing the letters in a string

module.exports = function(str) {
	return str.split('').sort().join('');
};