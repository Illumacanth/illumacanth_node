var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET color_picker. */
router.get('/', function(req, res, next) {
  var redis_client = redis.createClient();
  redis_client.get('default_color', function(err, reply) {
    default_color = reply;
    res.render('color_picker', { title: 'Illumacanth', current_color: default_color });
  });
});

module.exports = router;
