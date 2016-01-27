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

			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				vm.mainName = data.id;
			});
			
			vm.socket.on('getMessage', function (data) {
				data = data.data;
				vm.emptyMessage = false;
				if (!data)
					$scope.$apply(function() {
						vm.messages = [];
					});
				else
				{
					$scope.$apply(function () {
						if (!vm.messages[data.chan])
							vm.messages[data.chan] = [];
						vm.messages[data.chan].push({ from: data.from, content: data.message});
						console.log(vm.messages);
					});
					$location.hash();
					$anchorScroll();
				}
			});

			vm.socket.on('setCurrentChan', function (data) {
				$scope.$apply(function () {
					vm.currentChan = data.chan;
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
					vm.socket.emit('send', {
						from: vm.mainName,
						message: vm.message,
						chan: vm.currentChan
					});
				vm.message = "";
			}
		$(".chat").niceScroll();
		} // add scrollable to zone
})();
