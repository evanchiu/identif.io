
//
// socket.io code
//
var socket = io.connect();

socket.on('connect', function () {
    $('#chat').addClass('connected');
});

socket.on('result', function (msg) {
    $('#results').append($('<p>').append($('<em>').text(msg)));
});

//
// dom manipulation code
//
$(function () {
    $('#send-letters').submit(function () {
        socket.emit('letters', $('#letters').val());
        clear();
        return false;
    });

    function clear () {
        $('#letters').val('').focus();
    };
});
