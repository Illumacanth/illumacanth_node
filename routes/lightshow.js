var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET layout_maker. */
router.get('/', function(req, res) {
  var redis_client = redis.createClient();
  redis_client.mget(['default_leds'], function(err, reply) {
    default_leds = reply[0];
    res.render('lightshow', { title: 'Illumacanth', default_leds: default_leds });
  });
});

module.exports = router;
