
//
// socket.io code
//
var socket = io.connect();

socket.on('connect', function () {
    $('#chat').addClass('connected');
});

socket.on('result', function (msg) {
    $('#results').append($('<li>').text(msg));
});

//
// dom manipulation code
//
$(function () {
    $('#send-letters').submit(function () {
        $('#results').empty();
        socket.emit('letters', $('#letters').val());
        clear();
        return false;
    });

    function clear () {
        $('#letters').val('').focus();
    };
});
