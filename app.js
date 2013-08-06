#!/usr/bin/env node
// identif.io
// app.js - the main node.js application

// Imports
var fs = require('fs'),
    path = require('path'),
    sio = require('socket.io'),
    static = require('node-static'),
    levelup = require('levelup'),
    alphabetize = require('./alphabetize');

// Configuration
var database = './dictionary.level.db';
var port = 7000;

// Database and list of words that have been used
var db = levelup(database);
var used = [];

// File Server
var app = require('http').createServer(handler);
app.listen(port);
console.log("Listening on port " + port);

var file = new static.Server(path.join(__dirname, 'public'));

function handler(req, res) {
    file.serve(req, res);
}

// Web Socket Server
var io = sio.listen(app);

io.sockets.on('connection', function (socket) {

    socket.on('letters', function (letters) {
        used = [];
        combinations(alphabetize(letters), function(result) {
            if (used.indexOf(result) == -1) {
                used.push(result);
                socket.emit('result', result);
            }
        });
    });
});

// function to run all combinations
function combinations(letters, callback) {
    var fn = function(active, rest) {
        // If there's no letters, or more than 9, return
        if (active.length > 9 || (!active && !rest))
            return;

        // If rest is empty, this is a final combination
        if (!rest) {

            // If the word exists in the dictionary, return it
            db.get(active, function(err, value) {
                if (!err) {
                    if (value.indexOf(':') == -1) {
                        setImmediate(callback, value);
                    } else {
                        var words = value.split(':');
                        for (var i = 0, len = words.length; i < len; i++) {
                            setImmediate(callback, words[i]);
                        }
                    }
                }
            });
        } else {
            fn(active + rest[0], rest.slice(1));
            fn(active, rest.slice(1));
        }
    }
    fn("", letters);
}
