var TwitterOauth = require('../twitterOauth');

exports.search = function(req, res) {
    query = req.query.q;

  //console.log(encodeURIComponent(query));
  TwitterOauth
    .getSearchResult(encodeURIComponent(query))
    .then(function(resultObject){
      res.json(resultObject);
    });
};