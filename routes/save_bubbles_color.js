var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_bubbles_color', function(req, res) {
  var val = req.body.bubbles_color;
  var client = redis.createClient();
  client.set('bubbles_color', val);
  res.send("set");
});

module.exports = router;
