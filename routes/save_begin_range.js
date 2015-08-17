var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_begin_range', function(req, res) {
  var val = req.body.begin_range;
  var client = redis.createClient();
  client.set('begin_range', val);
  res.send("set");
});

module.exports = router;
