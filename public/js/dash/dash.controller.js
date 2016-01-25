(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$scope', '$location', 'socket'];

		function DashController($scope, $location, socket) {
			var vm = this;
			vm.socket = socket;
			vm.send = send;

			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				vm.mainName = data.id;
			});
			vm.socket.on('getMessage', function (data) {
				console.log(data);
			});

			function send () {
				vm.socket.emit('send', {
					from: vm.mainName,
					chan: vm.currentChan,
					message: vm.message
				});
			}

			$(".chat").niceScroll();// # sale
		}
})();
