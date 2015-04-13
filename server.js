var express = require('express');
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

app.get('/script.js', function (req, res) {
	var options = {
		root: __dirname + '/public/',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	res.sendFile('script.js', options, function (err) {
		if (err) { console.log('aww... ' + err); }
	});
});

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
	socket.on('message', function (message) {
		console.log('server got a message :' + message);
        var data = { 'message' : message };
        socket.broadcast.emit('message', data);
	});
	socket.on('disconnect', function () {
		socket.broadcast.emit('disconnected');
		console.log('bailing out');
	});
});
