var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET home page. */
router.get('/', function(req, res, next) {
  var client = redis.createClient();
  var show = "?";
  client.get('current', function(err, reply) {
    show = reply;
    res.render('index', { title: 'Illumacanth', current_show: show });
  });
});

module.exports = router;
