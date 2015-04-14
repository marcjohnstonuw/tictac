var express = require('express');
var path = require('path');
var app = express();

var redSock = null;
var blueSock = null;

app.get('/', function (req, res) {
	var options = {
		root: __dirname + '/public/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	res.sendFile('home.html', options, function (err) {
		if (err) { console.log('aww... ' + err); }
	});
});

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3000, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);

});


/*
Sockets stuff
*/

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	if (redSock === null) {
		redSock = socket;
		redSock.emit('gameStatus', 'Waiting');
	} else if (blueSock === null) {
		blueSock = socket;
		redSock.emit('teamUpdate', {
			myTeamName: 'Red',
			opponentTeamName: 'Blue'
		});
		blueSock.emit('teamUpdate', {
			myTeamName: 'Blue',
			opponentTeamName: 'Red'
		});
		redSock.broadcast.emit('gameStatus', 'Red\'s turn');
	} else {
		//observer??
	}
	socket.on('message', function (message) {
		console.log('server got a message :' + message);
        var data = { 'message' : message };
        socket.broadcast.emit('message', data);
	});
	socket.on('disconnect', function () {
		socket.broadcast.emit('disconnected');
		if (socket === redSock) {
			console.log('red bailed');
		} else if (socket === blueSock) {
			console.log('blue bailed');
		}
		console.log('bailing out');
	});
});