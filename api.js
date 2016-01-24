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

/*
 * not required when sever serve pages?
app.use(function (req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
		res.setHeader('Access-Control-Allow-Credentials', true);
		next();
});
*/

app.get('/', function (req, res) {
	res.render('login.html', {
		pagename: 'awesome people',
	});
});

server.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
