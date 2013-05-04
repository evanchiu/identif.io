// identif.io
// app.js - the main node.js application

var fs = require('fs'),
    path = require('path'),
    sio = require('socket.io'),
    static = require('node-static');

var app = require('http').createServer(handler);
app.listen(8000);

var file = new static.Server(path.join(__dirname, 'public'));

function handler(req, res) {
    file.serve(req, res);
}

var io = sio.listen(app);

io.sockets.on('connection', function (socket) {

    socket.on('letters', function (letters) {

        socket.emit('result', letters);

        setTimeout(function() {
        	socket.emit('result', 'abcdefg');
        }, 1000);
    });
});
