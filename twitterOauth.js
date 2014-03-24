var https = require('https'),
  querystring = require('querystring'),
  Q = require('q'),
  settings = {
    twitterApiHost: 'api.twitter.com',
    bearerTokenCredential: 'Y3dKWkJ2Qm9PeGxOOWx5SUZNTENYZzpkdXZsNnI5NW9CZGpxWjgwdEZlMFJCeGNsOGphdGxMOERmZG5CbW9MZ3c='
  };

function TwitterOauth(bearerTokenCredential) {
  this.initPromise = this.init();
}

TwitterOauth.prototype = {
  init: function() {
    var deferred = Q.defer(),
      options = {
        host: settings.twitterApiHost,
        path: '/oauth2/token',
        headers: {
          'Authorization': 'Basic ' + settings.bearerTokenCredential,
          'Content-Type': ' application/x-www-form-urlencoded;charset=UTF-8',
        },
        method: 'POST'
      },
      postData = querystring.stringify({
        'grant_type': 'client_credentials',
      }),
      postReq = https.request(options, function(res) {
        res.setEncoding('utf8');
        var responseString = '';

        res.on('data', function(chunk) {
          responseString += chunk;
          console.log('Bearer Token Response: ' + chunk);
        });

        res.on('end', function() {
          var resultObject = JSON.parse(responseString);
          deferred.resolve(resultObject.access_token);
        });
      });

    postReq.on('error', function(e) {
      console.log(e.message);
      deferred.reject(new Error(e));
    });

    postReq.write(postData);
    postReq.end();

    return deferred.promise;
  },
  getSearchResult: function(kw) {
    var deferred = Q.defer();
    this.initPromise
      .then(function(bearerToken) {
        https.get({
          host: settings.twitterApiHost,
          path: '/1.1/search/tweets.json?count=30&result_type=recent&include_entities=true&q=' + kw,
          headers: {
            'Authorization': 'Bearer ' + bearerToken
          },
        }, function(res) {
          res.setEncoding('utf8');
          var responseString = '';

          res.on('data', function(chunk) {
            responseString += chunk;
            //console.log('Search Response: ' + chunk);
          });

          res.on('end', function() {
            //var resultObject = JSON.parse(responseString);
            //console.log(resultObject);
            deferred.resolve(responseString);
          });

        }).on('error', function(e) {
          console.log("Got error: " + e.message);
          deferred.reject(new Error(e));
        });
      });
    return deferred.promise;
  }
};

module.exports = new TwitterOauth();