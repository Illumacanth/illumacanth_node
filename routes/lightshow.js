var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET layout_maker. */
router.get('/', function(req, res) {
  res.render('lightshow', { title: 'Illumacanth' });
});

module.exports = router;
