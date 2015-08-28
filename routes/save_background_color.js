var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_background_color', function(req, res) {
  var val = req.body.background_color;
  var client = redis.createClient();
  client.set('background_color', val);
  res.send("set");
});

module.exports = router;
