(function() {
  'use strict';
  var featuresConf;

  angular.module('app', ['ui.router', 'featureToggle', 'app.featuresConf'])
    .config(function($stateProvider, featureToggleProvider/*, featuresConf*/) {
        featureToggleProvider.init(featuresConf);
    })
    .run(function($rootScope, featureToggle) {
      $rootScope.featureToggle = featureToggle;
    });


    angular.element(document).ready(function() {
      fetch('/features.json').then(function(response) {
        response.json().then(function(features) {
          featuresConf = features;
          angular.bootstrap(document, ['app']);
        })
      });
    });


})();
