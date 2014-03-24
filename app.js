/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  twitterSearch = require('./routes/twitterSearch'),
  http = require('http'),
  path = require('path'),
  TwitterOauth = require('../twitterOauth');


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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/twitter_search', twitterSearch.search);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
  setInterval(function() {
    var q1 = '#太陽花學運 +exclude:retweets OR #反黑箱服貿 +exclude:retweets OR #反服貿黑箱黑箱服貿 +exclude:retweets',
      q2 = '#佔領立法院 +exclude:retweets OR 佔領立法院 +exclude:retweets',
      q3 = '#太陽花學運公告 #佔領立法院 +exclude:retweets';
    TwitterOauth
      .getSearchResult(encodeURIComponent(q1))
      .then(function(resultObject) {
        app.set(q1, resultObject);
      });
    TwitterOauth
      .getSearchResult(encodeURIComponent(q2))
      .then(function(resultObject) {
        app.set(q2, resultObject);
      });
    TwitterOauth
      .getSearchResult(encodeURIComponent(q3))
      .then(function(resultObject) {
        app.set(q3, resultObject);
      });
  }, 10000);
});

exports = app;