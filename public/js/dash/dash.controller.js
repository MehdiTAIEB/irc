(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$scope', '$location', 'socket', '$anchorScroll'];

		function DashController($scope, $location, socket, $anchorScroll) {
			var vm = this;
			vm.socket = socket;
			vm.send = send;
			vm.currentChan = "";
			vm.emptyMessage = true;
			vm.messages = [];
			vm.chans = [];
			vm.nick = "";
			vm.joinedChans = [];
			vm.users = [];

			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				if (!vm.mainName)
					vm.mainName = data.id;
				else
					vm.nick = data.id;
			});
			
			vm.socket.on('newUser', function (data) {
				$scope.$apply(function () {
					vm.users = data.users;
				});
				console.log(vm.users);
			});
			vm.socket.on('getMessage', function (data) {
				data = data.data;
				vm.emptyMessage = false;
				if (!data)
					$scope.$apply(function () {
						vm.messages = [];
					});
				else
				{
					$scope.$apply(function () {
						if (!vm.messages[data.chan])
							vm.messages[data.chan] = [];
						if (vm.joinedChans[data.chan])
							vm.messages[data.chan].push({ from: data.from, content: data.message});
						console.log(vm.joinedChans);
					});
					$location.hash();
					$anchorScroll();
				}
			});

			vm.socket.on('setCurrentChan', function (data) {
				$scope.$apply(function () {
					vm.currentChan = data.chan;
					if (!vm.joinedChans[data.chan])
						vm.joinedChans[data.chan] = true;
				});
			});

			vm.socket.emit('getChans', {});

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
					var alias = vm.nick ? vm.nick : vm.mainName;
					console.log(alias);
					vm.socket.emit('send', {
						from: alias,
						message: vm.message,
						chan: vm.currentChan
					});
				}
				vm.message = "";
			}
		$(".chat").niceScroll();
		} // add scrollable to zone
})();
