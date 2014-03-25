'use strict';

angular.module('csstaApp', [
  'components',
  'ngRoute'
])
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/', {
        templateUrl: 'templates/index.html',
        controller: 'IndexController'
      }).
      when('/about', {
        templateUrl: 'templates/about.html'
      }).
      otherwise({
        redirectTo: '/'
      });
    }
  ])
  .controller('IndexController', function($scope) {
    var feedLoaders = [];
    $scope.addFeedLoader = function(feedLoader) {
      feedLoaders.push(feedLoader);
    };
  });