var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_wave_on', function(req, res) {
  var val = req.body.wave_on;
  var client = redis.createClient();
  client.set('wave_on', val);
  res.send("set");
});

module.exports = router;
