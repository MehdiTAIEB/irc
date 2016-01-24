(function() {
	'use strict';

	angular
		.module('app', []); // maybe nothing
})();

/*
user object
current chans can be multiple --> create chan leave/join chan kick user from chan
current name -- change name in a chan context

object chan
	feed  --> display
	users --> listing
*/

// socket.user =
// {
//	socket.mainName
//	socket.chans {key = chan name : value = login in this chan default = mainName} // handle tabs
//	socket. current feed/chan // for a selected tab
//	socket. current nick // for a selected tab
// }
// tabs = on click display feed by name get on tab value
// if not selected tab get a new message light it ?
// on the left navbarstyle

// same page so if isset main name hide all login form else hide other// rename login by index.html

// emit message with parameter that id user and feed then broadcast it to the chan
//

// add angular to client without route system just to make dom interaction easier
