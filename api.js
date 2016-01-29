var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var swig  = require('swig');

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

var conv = [];
var uic = [];
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
	
	socket.on('usersInChan', function (data) {
		console.log(data, 'asd');
		socket.broadcast.emit('final', { lol: data});
	});
	socket.on('login', function (data) { // supose to stock in socket object // login
		if (data.name)
		{
			socket.mainName = data.name;
			users.push({ name: data.name });
			socket.broadcast.emit('newUser', { users: users }); // broadcast
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
		{
			if (!conv[data.chan])
				conv[data.chan] = []; // if not already
			conv[data.chan].push({ from: data.from, msg: data.message});
			console.log(conv);
			socket.emit('getMessage', { data: data });
			socket.broadcast.emit('getMessage', { data: data }); // brodcast
		}
		else // command interpretation
		{
			splittedMessage = data.message.split(" "); // split to check parameter number and get parameters
			if (splittedMessage.length > 3) // lenght sup a 2 = trop de parametre , if le premier == que /
				console.log('to many parameter');
			else if (splittedMessage.length == 3)
			{
				cCommand = splittedMessage[0].substr(1);
				if (cCommand == 'msg')
					socket.broadcast.emit('personal', { from: socket.mainName, to: splittedMessage[1], content: splittedMessage[2]});
				console.log(splittedMessage);
				
			}
			else if (splittedMessage.length == 2) // command with parameter
			{
				cleanCommand = splittedMessage[0].substr(1);
				switch (cleanCommand)
				{
					case "nick":
						if (availableCommand.nick)
						{
							console.log('change nickname');
							socket.emit('id', { id: splittedMessage[1]});
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
								//socket.emit('getMessage', { chan: "" }); // useless?
								socket.emit('setCurrentChan', { chan: splittedMessage[1] });
							}
							else
							{
								chans.push(splittedMessage[1]);
								socket.emit('setCurrentChan', { chan: splittedMessage[1] });
								socket.broadcast.emit('chans', { chans: chans });
								socket.emit('chans', { chans: chans });
							}
							socket.emit('id', { id: socket.mainName });
						}
						break;
					case "list":
						if (availableCommand.list) // list available chan avec un like fait sur le param 2
						{
							var sc = [];
							for (var i = 0; i < chans.length; i++)
							{
								if (chans[i].indexOf(splittedMessage[1]) > -1)
									sc.push(chans[i]);
							}
							if (sc.push)
								socket.emit('listChans', { chans: sc});
							console.log(sc); //reg exp
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
							socket.emit('leaveChan', {});
							console.log('leave current chan');
						}
						break;
					case "users":
						if (availableCommand.users)
						{
							console.log(data);
							socket.broadcast.emit('getAllCurrent', { chan: data.chan, to: socket.mainName });
							console.log('display all users in this chan');
						}
						break;
					case "list":
						if (availableCommand.list)
						{
							socket.emit('listChans', { chans: chans } );
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
