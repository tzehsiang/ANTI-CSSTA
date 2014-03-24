var app = require('../app');

exports.search = function(req, res) {
    query = req.query.q;

  res.json(app.set(query));
};