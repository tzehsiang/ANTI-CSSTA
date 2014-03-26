angular.module('components', [])
  .directive('feeds', function() {
    var updateFeeds = function($scope, $http) {
      var kws = $scope.keywords.split(',');

      //$scope.feedLoader.load();
      $scope.tags = kws;
      if ($scope.source === 'twitter') {
        var query = kws.join(' +exclude:retweets OR ');
        query = query + " +exclude:retweets";
        $http.get('/twitter_search?q=' + encodeURIComponent(query)).success(function(data) {
          if (data.statuses) {
            $scope.feeds = data.statuses;
            //$scope.feedLoader.loaded();
          }
        });
      }
    };

    return {
      restrict: 'E',
      scope: {
        keywords: '@',
        source: '@',
        topic: '@',
        type: '@',
        feedLoader: '='
      },
      controller: function($scope, $element, $http, $interval) {
        updateFeeds($scope, $http);
        var update = $interval(function() {
          return function() {
            updateFeeds($scope, $http);
          };
        }(), 10000);

        $scope.encodedTag = function(tag) {
          return encodeURIComponent(tag);
        };

        $scope.getTypeClass = function() {
          if ($scope.type === 'announce') {
            return 'alt';
          } else {
            return '';
          }
        };
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
        //remove urls
        scope.feed.text = scope.feed.text.replace(/(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/g, '');

        if (scope.tags.indexOf('#太陽花學運公告') === -1) {
          var re = new XRegExp('#(\\p{L})+', 'g');
          scope.feed.text = scope.feed.text.replace(re, '');
        }
        // scope.getTextWithHashTags = function() {
        //   //add tags
        //   var re = new XRegExp('#(\\p{L})+', 'g');
        //   //var re = new RegExp('#.+(?!#)','g'),
        //   tags = scope.feed.text.match(re);
        //   return scope.feed.text.replace(re, '<a href="https://twitter.com/search?q=$0">$1</a>');
        // };

        scope.getCreatedTime = function() {
          return new Date(scope.feed.created_at).toLocaleString();
        };
      },
    };
  });