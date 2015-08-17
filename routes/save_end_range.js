var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_end_range', function(req, res) {
  var val = req.body.end_range;
  var client = redis.createClient();
  client.set('end_range', val);
  res.send("set");
  console.log("set end range");
});

module.exports = router;

