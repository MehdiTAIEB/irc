(function () {
	angular
		.module('irc')
		.controller('DashController', DashController);

		DashController.$inject = ['$location', 'socket'];

		function DashController($location, socket) {
			var vm = this;
			vm.socket = socket;
			vm.send = send;

			vm.socket.emit('getId', {});
			vm.socket.on('id', function (data) {
				vm.mainName = data.id;
			});
			vm.example = [
				{ name: "mehdi" },
				{ name: "oussama"},
				{ name: "samir"},
				{ name: "ihab"}
			];

			function send () {
				console.log(vm.message); // emit on serve
			}

			$(".chat").niceScroll();// # sale
		}
})();
