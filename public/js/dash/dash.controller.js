(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$scope', '$location', 'socket', '$anchorScroll'];

		function DashController($scope, $location, socket, $anchorScroll) {
			var vm = this;
			vm.socket = socket;
			vm.send = send;
			vm.currentChan = "home";
			vm.emptyMessage = true;
			vm.messages = [];
			vm.chans = [];
			vm.nick = "";
			vm.joinedChans = [];
			vm.users = [];
		
			vm.socket.on('final', function (data) {
				if (data.lol.to == vm.mainName)
					$scope.$apply(function () {
						console.log(data.lol.user);
						if (!vm.usersInCurrentChan)
							vm.usersInCurrentChan = [];
						var ok = false;
						if ($.inArray(data.lol.user, vm.usersInCurrentChan) == -1)
							ok = true
						console.log(ok);
						if (ok)
							vm.usersInCurrentChan.push(data.lol.user);
						console.log(vm.usersInCurrentChan);// clean if /users again
					})
			});

			vm.socket.on('getAllCurrent', function (data) {
				if (vm.currentChan == data.chan) // if in requested chan send pseudo ??? find a way to store it
					socket.emit('usersInChan', { user: vm.mainName, to: data.to});
			});
			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				if (!vm.mainName)
					vm.mainName = data.id;
				else
					vm.nick = data.id;
			});
			
			vm.socket.on('newUser', function (data) { // on construction
				$scope.$apply(function () {
					vm.users = data.users;
				});
			});
			vm.socket.on('getMessage', function (data) {
				data = data.data;
				vm.emptyMessage = false;

				if (!data) // verify if useless or not
					$scope.$apply(function () {
						vm.messages[vm.currentChan] = [];
					});
				else
				{
					$scope.$apply(function () {
						if (!vm.messages[data.chan])
							vm.messages[data.chan] = [];
						if (vm.joinedChans[data.chan])
						{
							vm.messages[data.chan].push({ from: data.from, content: data.message});
							//vm.messages[data.chan]['nick'] = data.from; here to handle the fact that keep nickname when change channel
						}
					});
					$location.hash();
					$anchorScroll();
				}
			});
			vm.socket.on('listChans', function (data) {
				if (data.chans)
				{
					console.log(data.chans);
					if (!vm.messages[vm.currentChan])
						vm.messages[vm.currentChan] = [];
					$scope.$apply(function () {
						vm.messages[vm.currentChan].push({ from: 'server', chans: data.chans });
					});
				}
			});

			vm.socket.on('personal', function (data) {
				console.log(data);
				if (data.to == vm.mainName || data.to == vm.nick)
					$scope.$apply(function () {
					if (!vm.messages[vm.currentChan])
						vm.messages[vm.currentChan] = [];
					vm.messages[vm.currentChan].push({ from: data.from, content: data.content});
				});
			});

			vm.socket.on('setCurrentChan', function (data) {
				$scope.$apply(function () {
					vm.currentChan = data.chan;
					if (!vm.joinedChans[data.chan])
						vm.joinedChans[data.chan] = true;
				});
			});

			vm.socket.emit('getChans', {});

			vm.socket.on('leaveChan', function () {
				$scope.$apply(function () {
					vm.messages[vm.currentChan] = []; // test
					vm.currentChan = "home"; //test
					vm.nick = "";
				});
			});
			vm.socket.on('chans', function (data) {
				$scope.$apply(function () {
					vm.chans = data.chans;
				});
			});
			
			function send () {
				if (!vm.currentChan && vm.message.charAt(0) !== "/")
				{
					vm.emptyMessage = false;
					vm.messages.push({ content: "no chan selected" });
				}
				else
				{
					var alias = vm.nick ? vm.nick : vm.mainName; // change nick process to get it from vm.mess[////][nick]
					vm.socket.emit('send', {
						from: alias,
						message: vm.message,
						chan: vm.currentChan
					});
				}
				if (vm.usersInCurrentChan)
					vm.usersInCurrentChan = false;
				vm.message = "";
			}
		$(".chat").niceScroll();
		} // add scrollable to zone
})();
