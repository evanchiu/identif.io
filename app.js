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

// Database and list of words that have been used
var db = levelup(database);
var used = [];

// File Server
var app = require('http').createServer(handler);
app.listen(8000);

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
            db.get(result, function(err, value) {
               if (!err && value == 1) {
                    socket.emit('result', result);
                }
            })
        })
    });
});

// function to run all combinations, then check the permutations of each
function combinations(letters, callback) {
    var fn = function(active, rest) {
        if (active.length > 9 || (!active && !rest))
            return;
        if (!rest) {
            db.get(active, function(err, value) {
                if (!err && value == 0) {
                    setImmediate(permutations, active, callback);
                }
            });
        } else {
            fn(active + rest[0], rest.slice(1));
            fn(active, rest.slice(1));
        }
    }
    fn("", letters);
}

// function to check all permutations, making a callback when an unused
// permutation is found
function permutations(letters, callback) {
    var fn = function(active, rest) {
        if (!rest) {
            if (used.indexOf(active) == -1) {
                used.push(active);
                callback(active);
            }
        } else {
            for (var i = 0; i < rest.length; i++) {
                fn(active + rest[i], rest.substr(0, i) + rest.substr(i+1));
            }
        }
    }
    fn("", letters);
}