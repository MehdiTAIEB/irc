(function() {
	'use strict';

	angular
		.module('app')
		.controller('LoginController', LoginController);

		function LoginController() {
			var vm = this;
			vm.login = login;
			vm.name = "singe";

			function login () {
				console.log(vm.mainName);
			};
		}
})();
