(function() {

angular.module('app.components')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'NEWdashboard/newDashboard.html',
          controller: 'NewDashboardController',
          controllerAs: 'dashboard',
          feature: 'dash',
          version: '^1'
        }
      );
  })
  .controller('NewDashboardController', function(featureToggle) {
    var dashboard = this;
    if (featureToggle.isVersion('dashboard', '^1.5')) {
      dashboard.message = 'this is the **SUPER NEW** dashboard (dashboard is ^1.5)';
    }
    else {
      dashboard.message = 'this is the **NEW** dashboard (dashboard is ^1 but NOT ^1.5)';
    }
  })
  .directive('dashboardChart',
    function() {
      return {
        restrict: 'AE',
        template: '<h3>shown only if admin is enabled</h3>'
      };
    }
  )
  .directive('dashboardChart2',
    function() {
      return {
        restrict: 'AE',
        template: '<h3>shown only if admin is ^1.2.0</h3>'
      };
    }
  )

})();
