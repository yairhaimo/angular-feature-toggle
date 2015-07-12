angular.module('app')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard'
        },
        featureToggleProvider.isVersion('dashboard', '^0')
      );
  })
  .controller('DashboardController', function() {
    var dashboard = this;
    dashboard.message = 'this is the old dashboard';
  });
