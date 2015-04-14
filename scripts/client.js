var socket = io.connect();

function addMessage(msg, pseudo) {
    $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage() {
    if ($('#messageInput').val() != "") 
    {
        socket.emit('message', $('#messageInput').val());
        addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
        $('#messageInput').val('');
    }
}

function joinGame() {
	console.log('clicked it baish');
    if ($("#playerName").val() != "")
    {
        socket.emit('joinGame', { name: $("#playerName").val() });
        //$('#playerName').hide();
        //$('#join').hide();
    }
}

socket.on('message', function (data) {
	console.log('message! :' + data)
    addMessage(data['message'], data['pseudo']);
});

socket.on('disconnected', function (data) {
	console.log('goodbye friend');
})

socket.on('gameStatus', function (data) {
    console.log('gameStatus :' + data);
    $('#gameStatus').html(data);
})

socket.on('game.opponentDisconnected', function (data) {
    console.log('disconnected :' + data);
    $('#gameStatus').html(data);
	socket.emit('game.newGame');
})

$(function() {
	console.log('hai');
    $("#joinGame").click(function() {joinGame()});
    $("#submit").click(function() {sentMessage();});
});