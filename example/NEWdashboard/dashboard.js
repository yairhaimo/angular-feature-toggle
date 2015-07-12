(function() {

var featureToggle;

angular.module('app')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'NEWdashboard/newDashboard.html',
          controller: 'NewDashboardController',
          controllerAs: 'dashboard'
        },
        featureToggleProvider.isVersion('dashboard', '^1')
      );

      featureToggle = featureToggleProvider;
  })
  .controller('NewDashboardController', function(featureToggle) {
    var dashboard = this;
    if (featureToggle.isVersion('dashboard', '^1.5')) {
      dashboard.message = 'this is the **SUPER NEW** dashboard';
    }
    else {
      dashboard.message = 'this is the **NEW** dashboard';
    }
  })
  .directive('dashboardChart',
    function() {
      return {
        restrict: 'AE',
        template: '<h3>Dashboard Chart</h3>'
      };
    }
  )
  .directive('dashboardChart2',
    function() {
      return {
        restrict: 'AE',
        template: '<h3>Dashboard Chart Super!</h3>'
      };
    }
  )

})();
