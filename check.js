#!/usr/bin/env node
// check.js
// A script to check for keys in the database

var levelup = require('levelup');
var alphabetize = require('./alphabetize');

// Establish database
var db = levelup('./dictionary.level.db');

// Function to add to database
function check(key) {
    var a = alphabetize(key)
    db.get(a, function(err, value) {
        if (err) {
            console.log('Database error:', err);
        } else {
            console.log(key + ' -> {' + a + ', ' + value + "}");
        }
    });
};

if (process.argv.length < 3) {
    console.log('usage: ', process.argv[1], ' <word>');
} else {
    check(process.argv[2]);
}

