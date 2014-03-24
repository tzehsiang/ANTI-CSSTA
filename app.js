/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  twitterSearch = require('./routes/twitterSearch'),
  http = require('http'),
  path = require('path'),
  TwitterOauth = require('./twitterOauth');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var feedsCache = {};

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/twitter_search', function(req, res) {
  var query = req.query.q;
  res.json(feedsCache[query]);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));

  setInterval(function() {
    var q1 = '#太陽花學運 +exclude:retweets OR #反黑箱服貿 +exclude:retweets OR #反服貿黑箱 +exclude:retweets OR 黑箱 +exclude:retweets OR 服貿 +exclude:retweets',
      q2 = '#佔領立法院 +exclude:retweets OR 佔領立法院 +exclude:retweets',
      q3 = '#太陽花學運公告 +exclude:retweets';
    TwitterOauth
      .getSearchResult(encodeURIComponent(q1))
      .then(function(result) {
        feedsCache[q1] = JSON.parse(result);
      });
    TwitterOauth
      .getSearchResult(encodeURIComponent(q2))
      .then(function(result) {
        feedsCache[q2] = JSON.parse(result);
      });
    TwitterOauth
      .getSearchResult(encodeURIComponent(q3))
      .then(function(result) {
        feedsCache[q3] = JSON.parse(result);
      });
  }, 10000);
});