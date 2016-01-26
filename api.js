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

var chans = [
	"voyages",
	"famille",
	"hack",
	"internet"
];

var users = [];
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
		{
			socket.mainName = data.name;
			users.push({ name: data.name });
		}
	});
	
	socket.on('getId', function () { // to get user info
		socket.emit('id', { id: socket.mainName });
	});

	socket.on('getChans', function () {
		socket.emit('chans', { chans: chans });
	});

	socket.on('setNewChan', function (data) {
		chans.push(data.name);
		socket.emit('chans', { chans: chans })
	});
	socket.on('send', function (data) {

		firstChar = data.message.charAt(0);
		if (firstChar !== "/")
			socket.emit('getMessage', { data: data }); // brodcast
		else // command interpretation
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
							console.log('change nickname');
						}
						break;
					case "join":
						if (availableCommand.join)
						{
							var ok = 0;
							for (var i = 0;i < chans.length;i++)
							{
								if (chans[i] == splittedMessage[1])
									ok = 1;
							}
							if (ok)
							{
								socket.emit('getMessage', { chan: "" });
								socket.emit('setCurrentChan', { chan: splittedMessage[1] });
							}
							else
							{
								chans.push(splittedMessage[1]);
								socket.emit('setCurrentChan', { chan: splittedMessage[1] });
								socket.emit('chans', { chans: chans });
							}
						}
						break;
					case "list":
						if (availableCommand.list) // list available chan avec un like fait sur le param 2
						{
							console.log('list + like pattern');
						}
						break;
					case "msg":
						if (availableCommand.msg)
						{ // check if user is logged in
							console.log('msg to one person');
						}
						break;
					default:
						console.log('unknown command for 2 params');
				}
			}
			else if (splittedMessage.length == 1) // handle multiparameter command declare wich are
			{
				cleanCommand = splittedMessage[0].substr(1);
				switch (cleanCommand)
				{
					case "part":
						if (availableCommand.part)
						{
							console.log('leave current chan');
						}
						break;
					case "users":
						if (availableCommand.users)
						{
							console.log('display all users in this chan');
						}
						break;
					case "list":
						if (availableCommand.list)
						{
							console.log('list available chans');
						}
						break;
					default:
						console.log('unknown command for one parameter');
				}
			}
		}
	});
});

server.listen(3000);
