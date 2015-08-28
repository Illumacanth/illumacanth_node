var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_mosaic_color', function(req, res) {
  var val = req.body.mosaic_color;
  var client = redis.createClient();
  client.set('mosaic_color', val);
  res.send("set");
});

module.exports = router;
