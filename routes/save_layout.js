var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_layout', function(req, res) {
  var val = req.body.default_layout;
  var client = redis.createClient();
  client.set('default_layout', val);
  res.send("set");
});

module.exports = router;
