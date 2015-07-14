angular.module('app.components')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard',
          feature: 'dash',
          version: '^0'
        }
      );
  })
  .controller('DashboardController', function() {
    var dashboard = this;
    dashboard.message = 'this is the old dashboard (dashboard is ^0)';
  });
