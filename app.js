var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var save_show = require('./routes/save_show');
var save_color = require('./routes/save_color');
var color_picker = require('./routes/color_picker');
var layout_maker = require('./routes/layout_maker');
var lightshow = require('./routes/lightshow');

var app = express();

var redis = require('redis');
var redis_client = redis.createClient(); //creates a new client

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// run in dev all the time so we get stack traces
app.set('env', 'development');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/color_picker', color_picker);
app.use('/layout_maker', layout_maker);
app.use('/lightshow', lightshow);
app.post('/save_show', save_show);
app.post('/save_color', save_color);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

var OPC = new require('./opc')
var client = new OPC('localhost', 7890);

function draw() {
    var millis = new Date().getTime();

    for (var pixel = 0; pixel < 512; pixel++)
    {
        var t = pixel * 0.2 + millis * 0.002;
        var red = 128 + 96 * Math.sin(t);
        var green = 128 + 96 * Math.sin(t + 0.1);
        var blue = 128 + 96 * Math.sin(t + 0.3);

        client.setPixel(pixel, red, green, blue);
    }
    client.writePixels();
}

setInterval(draw, 30);

