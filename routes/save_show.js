var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_show', function(req, res) {
  var val = req.body.show;
  var client = redis.createClient();
  client.set('current', val);
});

module.exports = router;
