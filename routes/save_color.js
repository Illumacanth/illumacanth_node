var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_color', function(req, res) {
  var val = req.body.default_color;
  var client = redis.createClient();
  client.set('default_color', val);
});

module.exports = router;
