angular.module('components', [])
  .directive('feeds', function() {
    var updateFeeds = function($scope, $http) {
      var kws = $scope.keywords.split(',');
      $scope.tags = kws;
      if ($scope.source === 'twitter') {
        var query = kws.join(' +exclude:retweets OR ');
        query = query + " +exclude:retweets";
        console.log(query);
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
        topic: '@',
        type: '@'
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
          if($scope.type === 'announce') {
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