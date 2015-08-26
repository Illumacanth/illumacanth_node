var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_leds', function(req, res) {
  try {
    var val = req.body.default_leds;
    var client = redis.createClient();
    client.set('default_leds', val);
    res.send("set");
  }
  catch(err) {
    console.log("redis error");
  }
});

module.exports = router;
