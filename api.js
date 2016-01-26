var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var swig  = require('swig');
var conversations = []; // store conv put watcher on it to broadcast messages "conv": { name: videogames, message: { from: me content: lol }}
var availableCommand = {
	nick : true,
	join : true,
	part : true,
	users : true,
	list : true,
	msg: true
};
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
app.use('/angular', express.static('view'));

app.get('/', function (req, res) {
	res.render('index.html', {
		title: 'My Irc', // testin variable
	});
});

io.on('connection', function (socket) {
	
	socket.on('login', function (data) { // supose to stock in socket object // login
		if (data.name)
			socket.mainName = data.name;
	});
	
	socket.on('getId', function () { // to get user info
		socket.emit('id', { id: socket.mainName });
	});

	socket.on('send', function (data) {
		
		firstChar = data.message.charAt(0);
		if (firstChar == "/") // command interpretation
		{
			splittedMessage = data.message.split(" "); // split to check parameter number and get parameters
			if (splittedMessage.length > 2) // lenght sup a 2 = trop de parametre , if le premier == que /
				console.log('to many parameter');
			else if (splittedMessage.length == 2) // command with parameter
			{
				cleanCommand = splittedMessage[0].substr(1);
				switch (cleanCommand)
				{
					case "nick":
						if (availableCommand.nick)
						{
							console.log('nick');
						}
						break;
					case "join":
						if (availableCommand)
						{
							console.log('join');
						}
						break;
					case "list":
						if (availableCommand.list) // list available chan avec un like fait sur le param 2
						{
							console.log('list');
						}
						break;
					case "msg":
						if (availableCommand.msg)
						{ // check if user is logged in
							console.log('msg to one person');
						}
					default:
						console.log('unknown command');
				}
			}
			else if (splittedMessage.length == 1) // handle multiparameter command declare wich are
			{
				cleanCommand = splittedMessage[0].substr(1);
				switch (cleanCommand)
				{
					case "part":
						//leave channel clean zone
						break;
					case "users":
						// list all in a chan
						break;
					case "list":
						// list chan available
						break;
				}
			}
		}
		else
			console.log('pas une commande'); // message to store
	});
});

server.listen(3000);
