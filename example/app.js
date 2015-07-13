(function() {
  'use strict';

  angular.module('app', ['ui.router', 'yh.featureToggle', 'app.components'])
    .run(function($rootScope, featureToggle) {
      $rootScope.featureToggle = featureToggle;
    });


    // get config from server and manually bootstrap
    angular.element(document).ready(function() {
      fetch('/example/features.json').then(function(response) {
        response.json().then(function(features) {
          window.angularFeaturesConf = features;
          angular.bootstrap(document, ['app']);
        })
      });
    });


})();
