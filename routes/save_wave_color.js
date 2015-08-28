var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_wave_color', function(req, res) {
  var val = req.body.wave_color;
  var client = redis.createClient();
  client.set('wave_color', val);
  res.send("set");
});

module.exports = router;
