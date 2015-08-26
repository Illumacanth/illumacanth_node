var express = require('express');
var router = express.Router();
var redis = require('redis');

/* PUT current show */
router.post('/save_layout', function(req, res) {
  try {
    var val = req.body.default_layout;
    var client = redis.createClient();
    client.set('default_layout', val);
    res.send("set");
  }
  catch(err) {
    console.log("redis error");
  }
});

module.exports = router;
