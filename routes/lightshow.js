var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET layout_maker. */
router.get('/', function(req, res) {
  var redis_client = redis.createClient();
  redis_client.mget(['default_leds','background_color','background_on','wave_color','wave_on'], function(err, reply) {
    var default_leds = reply[0];
    var background_color = reply[1];
    var background_on = ( reply[2] === 'true');
    var wave_color = reply[3];
    var wave_on = ( reply[4] === 'true');
    res.render('lightshow', { title: 'Illumacanth', default_leds: default_leds, background_color: background_color, background_on: background_on, wave_color: wave_color, wave_on: wave_on  });
  });
});

module.exports = router;
