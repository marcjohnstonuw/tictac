var express = require('express');
var path = require('path');
var app = express();

var redSock = null;
var blueSock = null;

var currentGames = {};
var gamesIndex = 0;

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

	socket.on('joinGame', function (message) {
		var myGameID;

		for (gid in currentGames) {
			if (!currentGames[gid].p2) {
				socket.myGameID = myGameID = gid;
				currentGames[gid].p2 = socket;
				socket.emit('game.joinedGame', { opponentName: currentGames[gid].p2.name } /*'id : ' + socket.id + 'Joining game ' + gid*/);
				console.log('alerting opponent :' + currentGames[gid].p1.id)
				currentGames[gid].p1.emit('game.opponentJoined', { opponentName: ''});
			}
		}

		if (!myGameID) {
			socket.myGameID = gamesIndex;
			socket.name = message.name;
			currentGames[gamesIndex] = {
				p1: socket
			}
			socket.emit('gameStatus', 'id : ' + socket.id + 'new game ' + gamesIndex + ', waiting for opponent');
			gamesIndex += 1;
		}
	});

	socket.on('message', function (message) {
		console.log('server got a message :' + message);
        var data = { 'message' : message };
        socket.broadcast.emit('message', data);
	});
	socket.on('disconnect', function () {
		//socket.broadcast.emit('disconnected');
		console.log('bailing out' + socket.id);
		if (currentGames[socket.myGameID]) {
			if (currentGames[socket.myGameID].p1 && currentGames[socket.myGameID].p1.id === socket.id) {
				currentGames[socket.myGameID].p1 = null;
				if (currentGames[socket.myGameID].p2) {
					currentGames[socket.myGameID].p2.emit('game.opponentDisconnect');
				}
			} else if (currentGames[socket.myGameID].p1 && currentGames[socket.myGameID].p2.id === socket.id) {
				currentGames[socket.myGameID].p2 = null;
				if (currentGames[socket.myGameID].p1) {
					currentGames[socket.myGameID].p1.emit('game.opponentDisconnect');
				}
			}
		}
	});
});