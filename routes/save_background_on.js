var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_background_on', function(req, res) {
  var val = req.body.background_on;
  var client = redis.createClient();
  client.set('background_on', val);
  res.send("set");
});

module.exports = router;
