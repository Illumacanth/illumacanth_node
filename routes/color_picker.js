var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET color_picker. */
router.get('/', function(req, res, next) {
  var redis_client = redis.createClient();
  redis_client.mget(['default_color','begin_range','end_range'], function(err, reply) {
    default_color = reply[0];
    begin_range = reply[1];
    end_range = reply[2];
    res.render('color_picker', { title: 'Illumacanth', current_color: default_color, begin_range: begin_range, end_range: end_range });
  });
});

module.exports = router;
