/**
 * Create AngularJS semver provider.
 */
var semver = require('semver');
(function(semver, angular) {
  'use strict';

  angular
    .module('semver', [])
    .provider('semver', [function() {
      return buildWrapper(semver);
    }]);

  /**
   * Dynamically builds a semver wrapper object that
   * meets AngularJS provider requirements.
   *
   * @param semver
   * @returns {{$get: Function}}
   */
  function buildWrapper(semver) {
    var wrapper = {
      $get: function(){}
    };
    for (var key in semver) {
      wrapper[key] = semver[key];
    }
    return wrapper;
  }
})(semver, window.angular);

/**
 * Create AngularJS featureToggle provider.
 */
(function(window, angular) {
  'use strict';

  var ng = angular.module('yh.featureToggle', ['semver']);
  ng.config(['featureToggleProvider', '$injector', function (featureToggleProvider, $injector) {
    initFeatures(featureToggleProvider);
    overrideUIRouterStateFn($injector, featureToggleProvider);

    /**
     *
     * @param featureToggleProvider
     */
    function initFeatures(featureToggleProvider) {
      if (window.angularFeaturesConf) {
        featureToggleProvider.init(window.angularFeaturesConf);
      }
      else {
        window.console.warn('could not detect features');
      }
    }

    /**
     * config ui router
     *
     * @param $injector
     * @param featureToggleProvider
     */
    function overrideUIRouterStateFn($injector, featureToggleProvider) {
      try {
        var $stateProvider = $injector.get('$stateProvider');

        // the app uses ui.router, configure it
        var oldStateFn = $stateProvider.state;
        $stateProvider.state = function(name, conf) {
          // enable state if feature version is satisfied or undefined
          if ((conf.version === undefined) || (featureToggleProvider.isVersion(conf.feature || name, conf.version))) {
            try {
              return oldStateFn.call($stateProvider, name, conf);
            }
            catch(e) {
              window.console && window.console.warn('state ' + name + ' is already defined'); // jshint ignore:line
              return $stateProvider;
            }
          }
          // else return stateProvider for further state declaration chaining
          else {
            return $stateProvider;
          }
        };
      } catch(e) {
        // the app doesnt use ui.router - silent failure
      }
    }
  }]);

  ng.provider('featureToggle', ['semverProvider', function (semverProvider) {
    /* jshint validthis:true */
    var semver = semverProvider;

    // define Feature model
    function Feature(version) {
      this.version = version;
    }

    Feature.prototype.isVersion = function(versionToCheck) {
      return semver.satisfies(this.version, versionToCheck);
    };

    Feature.prototype.isEnabled = function() {
      return semver.satisfies(this.version, '*');
    };

    /////////////////
    var features = {};

    var service = {
      init: init,
      features: features,
      isVersion: isVersion,
      isEnabled: isEnabled,
      $get: featureToggleFactory
    };
    return service;

    /**
     *
     * @param featuresObj
     */
    function init(featuresObj) {
      features = featuresObj;
    }

    /**
     *
     * @param feature
     * @param versionToCheck
     * @returns {*}
     */
    function isVersion(feature, versionToCheck) {
      return semver.satisfies(features[feature], versionToCheck);
    }

    /**
     *
     * @param feature
     * @returns {boolean}
     */
    function isEnabled(feature) {
      return !!features[feature];
    }

    /**
     *
     * @returns {{isVersion: isVersion, isEnabled: isEnabled}}
     */
    function featureToggleFactory() {
      return {
        isVersion: isVersion,
        isEnabled: isEnabled
      };
    }
  }]);

  ng.directive('showIfFeature', ['featureToggle', function (featureToggle) {
    var ddo = {
      restrict: 'AE',
      transclude: 'element',
      terminal: true,
      priority: 999,
      link: link
    };

    return ddo;

    /**
     *
     * @param scope
     * @param element
     * @param attrs
     * @param ctrl
     * @param $transclude
     */
    function link(scope, element, attrs, ctrl, $transclude) {
      var featureEl, childScope, featureName;
      var featureVersion = '*';
      var args = attrs.showIfFeature.split(/\s+/);
      featureName = args[0];
      if (args.length > 1) {
        featureVersion = args[1];
      }

      if (featureToggle.isVersion(featureName, featureVersion)) {
        childScope = scope.$new();
        $transclude(childScope, function(clone) {
          featureEl = clone;
          element.after(featureEl).remove();
        });
      } else {
        if(childScope) {
          childScope.$destroy();
          childScope = null;
        }
        if(featureEl) {
          featureEl.after(element).remove();
          featureEl = null;
        }
      }
    }
  }]);

  ng.directive('hideIfFeature', ['featureToggle', function hideIfFeature(featureToggle) {
    var ddo = {
      restrict: 'AE',
      transclude: 'element',
      terminal: true,
      priority: 999,
      link: link
    };

    return ddo;

    /**
     *
     * @param scope
     * @param element
     * @param attrs
     * @param ctrl
     * @param $transclude
     */
    function link(scope, element, attrs, ctrl, $transclude) {
      var featureEl, childScope, featureName;
      var featureVersion = '*';
      var args = attrs.hideIfFeature.split(/\s+/);
      featureName = args[0];
      if (args.length > 1) {
        featureVersion = args[1];
      }

      if (featureToggle.isVersion(featureName, featureVersion)) {
        if(childScope) {
          childScope.$destroy();
          childScope = null;
        }
        if(featureEl) {
          featureEl.after(element).remove();
          featureEl = null;
        }
      } else {
        childScope = scope.$new();
        $transclude(childScope, function(clone) {
          featureEl = clone;
          element.after(featureEl).remove();
        });
      }
    }
  }]);

})(window, window.angular);
