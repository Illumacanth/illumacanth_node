var express = require('express');
var router = express.Router();
var redis = require('redis');

/* GET color_picker. */
router.get('/color_picker', function(req, res, next) {
  res.render('color_picker', { title: 'Illumacanth', current_show: show });
});

module.exports = router;
