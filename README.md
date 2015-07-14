[![npm version](https://badge.fury.io/js/angular-feature-toggle.svg)](http://badge.fury.io/js/angular-feature-toggle)

# angular-feature-toggle

## Synopsis
This library lets you manage features in the frontend using a semver notation.  
Inspired by [angular-feature-flags](https://github.com/mjt01/angular-feature-flags).

## Examples and Demo
Check out the [example](https://github.com/yairhaimo/angular-feature-toggle/tree/master/example) directory for a simple usage of the library or this [plunker](http://plnkr.co/edit/j49u6oqQ6ulppqUphhMq) for the same demo.

## Installation
```sh
npm install angular-feature-toggle --save
```
```js
angular.module('main.app', ['yh.featureToggle'])
```
## Configuration
angular-feature-toggle uses a semver notation per feature and expects a configuration of this nature:
```js
{
    "feature1": "1.5.1",
    "feature2": "0.5.6"
}
```
This configuration toggles features inside the code according to their version conditions.
```
//Example for "feature1" : "1.5.1"
//^1.0.0 - true
//~1.5.0 - true
//~1.6.0 - false
//^2 - false
//* - true
```
For more information regarding the semver notation head over to the [semver](http://semver.org/) and the [node-semver](https://github.com/npm/node-semver) sites.

**NOTE**: In order to configure itself at angular's config phase angular-feature-toggle is, at the moment, dependant on a property named 'angularFeaturesConf' on the global window object.

##### Manual setting  
For hardcoded values you can set the property manually:
```js
window.angularFeaturesConf = {dashboard: '1.0.0', admin: '0.5.1'};
```
For a dynamic feature loading method take a look at the [serverside feature loading example](#serversideLoading).


## ui.router
angular-feature-toggle detects if ui.router is in use and wraps it with a feature-toggle helper function.  
You can now define your states this way:
```js
   $stateProvider
     .state('master.dashboard',
        {
          url: '/dashboard',
          templateUrl: 'dashboard/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'dashboard',
          feature: 'dash', //optional
          version: '^0.5.1'
        }
      )
      .state('master.dashboard',
        {
          url: '/dashboard',
          templateUrl: 'NEWdashboard/newDashboard.html',
          controller: 'NewDashboardController',
          controllerAs: 'dashboard',
          feature: 'dash', //optional
          version: '^1'
        }
      );
```
Note that both states have the same name but different version conditions (***^0.5.1*** vs ***^1***).  
If the version is not satisfied for a specific state definition then that definition will be **ignored**.  
If more than one version of the same state is satisfied the first one will be defined and a warning message will be logged for the following ones.  
The 'feature' property is optional, if omitted the state name is considered to be the feature name.  
**NOTE**: if you omit the version parameter in the state definition then a regular state will be defined.


## Toggle features using a directive
There are two directives you can use in order to toggle features: **show-if-feature** and **hide-if-feature**.  
Basically they act as ng-if and the opposite of ng-if. They add/remove elements from the DOM if a feature is enabled or satisfies a certain version.
```html
<div show-if-feature="admin">
    This is the admin panel
</div>
```
With a specific version:
```html
<!-- will be shown if the admin feature exists and satisfies the version ^1 -->
<div show-if-feature="admin ^1">
    This is the admin panel
</div>
<!-- will be shown if the admin feature exists and satisfies the version ~2.0.1 -->
<div show-if-feature="admin ~2.0.1">
    This is the NEW and improved admin panel
</div>
<!-- will not be shown if the widget feature is enabled -->
<div hide-if-feature="widgets">
    Widgets coming soon...
</div>
```

## Toggle features programmatically
You can use the ***featureToggle*** factory to check feature version:
```js
    .controller('HomeController', function(featureToggle) {
        if (featureToggle.isEnabled('admin')) {
            this.message = 'welcome administrator!';
        }
        if (featureToggle.isVersion('admin', '^2')) {
            this.items = [1,2,3];
        }
    });
```
The featureToggle is also a provider and can be used inside ***.config*** blocks:
```js
.config(function(featureToggleProvider) {
    if (featureToggleProvider.isVersion('dashboard', '~3.5.0')) {
        // do something
    }
});
```
**NOTE**: since angular-feature-toggle configures itself in a ***.config*** block it must be defined as a module dependancy in order for its .config block to run prior to the one that is using it.

## Serverside feature configuration loading<a name="serversideLoading"></a>
Since we intialize the feature configuration in a ***.config*** block (in order to support state versioning) we cannot use the $http service to load the feature configuration from the server ($http is not injectable into a config block).
What we can do is first load the configuration with vanilla javascript and only once its loaded manually bootstrap the angular applcation:
```js
angular.element(document).ready(function() {
  fetch('/example/features.json').then(function(response) {
    response.json().then(function(features) {
      window.angularFeaturesConf = features;
      angular.bootstrap(document, ['app']);
    })
  });
});
```
This example uses the new [***fetch***](https://developers.google.com/web/updates/2015/03/introduction-to-fetch?hl=en) API for brevity but you can use any ajax function you wish.

## Limitations and TODOs
* Dependency on a global window property - angularFeaturesConf
* Cannot load feature configuration for a specific user since the feature initialization is done in the config phase
* Reduce library size (uses the entire node-semver library atm, need only a subset of that)
