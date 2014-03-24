'use strict';

angular.module('csstaApp', [
  'components',
  'ngRoute'
]).config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/', {
      templateUrl: 'templates/index.html'
    }).
    when('/about', {
      templateUrl: 'templates/about.html'
    }).
    otherwise({
      redirectTo: '/'
    });
  }
]);