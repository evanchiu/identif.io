#!/usr/bin/env node
// predeploy.js
// A script for running predeployement code

var levelup = require('levelup');
var http = require('http');
var alphabetize = require('./alphabetize');

var wordlist = 'http://scrapmaker.com/data/wordlists/twelve-dicts/2of12.txt';
var database = './dictionary.level.db';
var bucket = '';

// Establish database
var db = levelup(database);

// Function to add to database
function addkey(key, value) {
    db.put(key, value, function(err) {
        if (err) {
            console.log('Database error:', err);
        }
    });
};

// Function to add word and its alphabetized version to the database
function addword(word) {
    if (word.length > 1 || word == 'i' || word == 'a') {
        var a = alphabetize(word);
        db.get(a, function(err, value) {
            if (err && err.name == "NotFoundError") {
                addkey(a, word);
            } else if (err) {
                console.log('Database error:', err);
            } else {
                addkey(a, value + ':' + word);
            }
        })
    }
}

// Establish http connection to wordlist
http.get(wordlist, function(res) {
    res.on('data', function(chunk) {
        var data = chunk.toString();
        // If there's data in the bucket, throw it on the front
        if (bucket != '') {
            data = bucket + data;
            bucket = '';
        }
        // If the data doesn't end with \n, cut off the last characters, put them in the bucket
        if (data.charAt(data.length - 1) != '\n') {
            var lastIndex = data.lastIndexOf('\n');
            bucket = data.substr(lastIndex + 1);
            data = data.substr(0, lastIndex + 1);
        }
        var words = data.split("\r\n");

        for (var i = 0, len = words.length - 1; i < len; i++) {
            addword(words[i]);
        }
    })
}).on('error', function(e) {
    console.log('Data acquisition error:', e.message);
});