var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var swig  = require('swig');

/*
 * Setup swig with express
 *
 */
app.engine('html', swig.renderFile);
app.set('views', __dirname + '/view');
app.set('view cache', false);
swig.setDefaults({ cache: false});

/*
 * Allow url access for stylesheet/client side javascript/fontAndImages
 *
 */
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.render('index.html', {
		title: 'My Irc', // testin variable
	});
});

io.on('connection', function (socket) {
	socket.on('login', function (data) {
		console.log(data.name);
		socket.emit('setAuth', { name: data.name });
	});
});

server.listen(3000);
