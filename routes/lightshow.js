var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET layout_maker. */
router.get('/', function(req, res) {
  var redis_client = redis.createClient();
  redis_client.mget(['default_leds','background_color','wave_color','bubbles_color','mosaic_color'], function(err, reply) {
    var default_leds = reply[0];
    var background_color = reply[1];
    var wave_color = reply[2];
    var bubbles_color = reply[3];
    var mosaic_color = reply[4];
    res.render('lightshow', { title: 'Illumacanth', default_leds: default_leds, background_color: background_color, wave_color: wave_color, bubbles_color: bubbles_color, mosaic_color: mosaic_color });
  });
});

module.exports = router;
