angular.module('components', [])
  .directive('feeds', function() {
    var updateFeeds = function($scope, $http) {
      var kws = $scope.keywords.split(',');
      $scope.tags = kws;
      if ($scope.source === 'twitter') {
        var query = kws.join(' OR ');
        $http.get('/twitter_search?q=' + encodeURIComponent(query)).success(function(data) {
          console.log(data);
          if (data.statuses) {
            $scope.feeds = data.statuses;
          }
        });
      }
    };

    return {
      restrict: 'E',
      scope: {
        keywords: '@',
        source: '@',
        topic: '@'
      },
      controller: function($scope, $element, $http, $interval) {
        updateFeeds($scope, $http);

        var update = $interval(function() {
          return function() {
            updateFeeds($scope, $http);
          };
        }(), 10000);
      },
      templateUrl: 'templates/feeds.html',
      replace: true
    };
  })
  .directive('feed', function() {
    return {
      restrict: 'E',
      require: '^feeds',
      templateUrl: 'templates/feed.html',
      replace: true,
      link: function(scope, element, attrs, feedsCtrl) {
        scope.getCreatedTime = function() {
          return new Date(scope.feed.created_at).toLocaleString();
        };
      },
    };
  });