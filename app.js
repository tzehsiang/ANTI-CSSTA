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

//default, for dev use
app.set('twitterBearerTokenCredential', 'bVJYWW5tdTBsdDF2RmNsZlVRYndtcTJTeDoyc1NTcGdqR0VNUlVrc1RCRDA0SkNsVG9Mcm5rWG5nS2cwZGJtclNQdVFlck0yRUFmUA==');

// production only
if ('production' == app.get('env')) {
  app.set('twitterBearerTokenCredential', 'QmoyeXVwNWFFWkU1eE9POXhmaUFNQjFPNjpJbElFS2pxbVVrYXdzQm9yWkZnQkt4RTZpVEd3WWlaTzVwWnp0c1hTeVBQNmZiM1p4Zg==');
}

app.get('/', routes.index);
app.get('/twitter_search', function(req, res) {
  var query = req.query.q;
  res.json(feedsCache[query]);
});

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Running in ' + app.get('env') + ' mode');

  app.configure('development', function() {
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  var twitterOauth = new TwitterOauth(app.get('twitterBearerTokenCredential'));

  setInterval(function() {
    var q1 = '#太陽花學運 +exclude:retweets -from:waronge OR #反黑箱服貿 +exclude:retweets -from:waronge OR #反服貿黑箱 +exclude:retweets -from:waronge OR 黑箱 +exclude:retweets -from:waronge OR 服貿 +exclude:retweets -from:waronge',
      q2 = '#佔領立法院 +exclude:retweets -from:waronge OR 佔領立法院 +exclude:retweets -from:waronge',
      q3 = '#太陽花學運公告 +exclude:retweets -from:waronge';

    twitterOauth
      .getSearchResult(encodeURIComponent(q1, 'mixed'))
      .then(function(result) {
        feedsCache[q1] = JSON.parse(result);
      });
    twitterOauth
      .getSearchResult(encodeURIComponent(q2, 'mixed'))
      .then(function(result) {
        feedsCache[q2] = JSON.parse(result);
      });
    twitterOauth
      .getSearchResult(encodeURIComponent(q3, 'recent'))
      .then(function(result) {
        feedsCache[q3] = JSON.parse(result);
      });
  }, 10000);
});