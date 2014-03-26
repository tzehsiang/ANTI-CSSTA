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
    $scope.feedLoader = {
      loadingCount: 0,
      $spinner: $('#page-spinner'),
      $feedLists: $('#hero-content .feed .feed-list'),
      load: function() {
        this.loadingCount++;
        if (this.loadingCount > 0) {
          this.showSpinner();
        }
      },
      loaded: function() {
        this.loadingCount--;
        if (this.loadingCount === 0) {
          this.hideSpinner();
        }
      },
      showSpinner: function() {
        this.$spinner.show();
        this.$feedLists.each(function(){
          $(this).addClass('dim-off');
        });
      },
      hideSpinner: function() {
        this.$spinner.hide();
        this.$feedLists.each(function(){
          $(this).removeClass('dim-off');
        });
      }
    };
  });