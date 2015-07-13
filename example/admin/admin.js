angular.module('app.components')
  .config(function($stateProvider, featureToggleProvider) {
     $stateProvider
     .state('admin', {
          url: '/admin',
          templateUrl: 'admin/admin.html',
          controller: 'AdminController',
          controllerAs: 'admin',
          version: '*'
        }
      );
  })
  .controller('AdminController', function() {
    var admin = this;
    admin.message = 'this is the admin panel';
  });
