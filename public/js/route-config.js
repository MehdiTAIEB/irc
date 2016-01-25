(function () {
	angular
		.module('irc')
		.config(routes)

		routes.$inject = ['$routeProvider'];

		function routes ($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'angular/auth/login.html',
					controller: 'LoginController',
					controllerAs: 'vm'
				})
				.when('/lol', {
					templateUrl: 'angular/dash/dash.html',
					controller: 'DashController',
					controllerAs: 'vm'
				})
		}
})();
