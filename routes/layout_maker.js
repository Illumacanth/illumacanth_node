var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET layout_maker. */
router.get('/', function(req, res) {
    var redis_client = redis.createClient();
    redis_client.mget(['default_layout'], function(err, reply) {
      default_layout = reply[0];
      res.render('layout_maker', { title: 'Illumacanth', current_layout: default_layout });
    });
});

module.exports = router;
