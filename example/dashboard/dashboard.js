angular.module('app.components')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'OLDdashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard',
          version: '^0'
        }
      );
  })
  .controller('DashboardController', function() {
    var dashboard = this;
    dashboard.message = 'this is the old dashboard (dashboard is ^0)';
  });
