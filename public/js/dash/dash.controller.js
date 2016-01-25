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

			function send () {
				vm.socket.emit('send', {
					from: vm.mainName,
					chan: vm.currentChan,
					message: vm.message
				});
				console.log(vm.mainName);
				console.log(vm.message); // emit on serve
			}

			$(".chat").niceScroll();// # sale
		}
})();
