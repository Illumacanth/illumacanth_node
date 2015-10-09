var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var save_show = require('./routes/save_show');
var save_background_color = require('./routes/save_background_color');
var save_background_on = require('./routes/save_background_on');
var save_wave_color = require('./routes/save_wave_color');
var save_wave_on = require('./routes/save_wave_on');
var save_begin_range = require('./routes/save_begin_range');
var save_end_range = require('./routes/save_end_range');
var save_layout = require('./routes/save_layout');
var save_leds = require('./routes/save_leds');
var color_picker = require('./routes/color_picker');
var layout_maker = require('./routes/layout_maker');
var lightshow = require('./routes/lightshow');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb'}));

var redis = require('redis');
var redis_client = redis.createClient(); //creates a new client

// view engine setup
//app.set('port', process.env.PORT || 3000);
app.listen(10101);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// run in dev all the time so we get stack traces
app.set('env', 'production');

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
app.post('/save_background_color', save_background_color);
app.post('/save_background_on', save_background_on);
app.post('/save_wave_color', save_wave_color);
app.post('/save_wave_on', save_wave_on);
app.post('/save_begin_range', save_begin_range);
app.post('/save_end_range', save_end_range);
app.post('/save_layout', save_layout);
app.post('/save_leds', save_leds);

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

    redis_client.mget(['wave_color','begin_range','end_range','background_color'], function(err, reply) {
      var wave_color = reply[0];
      var begin_range = reply[1];
      var end_range = reply[2];
      var background_color = reply[3];

      if(wave_color == null){
        wave_color = "#0055FF";
      }

      if(begin_range == null){
        begin_range = 0;
      }

      if(end_range == null){
        end_range = 0;
      }

      var R_w = hexToR(wave_color);
      var G_w = hexToG(wave_color);
      var B_w = hexToB(wave_color);

      var R_b = hexToR(background_color);
      var G_b = hexToG(background_color);
      var B_b = hexToB(background_color);

      function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
      function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
      function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
      function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}


      var millis = new Date().getTime();

      for (var pixel = 0; pixel < 6656; pixel++)
      {
        var t = pixel * 0.2 + millis * 0.002;
        var red = 0;
        var green = 0;
        var blue = 0;
        var increase = 0.8;
        if(pixel > begin_range && pixel < end_range){
          red = 256;
          green = 256;
          blue = 256;
        }else if(pixel < 5120){
          red = 256 * (Math.sin(t/2)) * (R_w/256);
          green = 256 * (Math.sin(t/2 + 0.2)) * (G_w/256);
          blue = 256 * (Math.sin(t/2 + 0.6)) * (B_w/256);
        }else{
          red = 256 * (Math.sin(t/2) + increase) * (R_b/256);
          green = 256 * (Math.sin(t/2 + 0.3) + increase) * (G_b/256);
          blue = 256 * (Math.sin(t/2 + 0.6) + increase) * (B_b/256);
        }
          client.setPixel(pixel, red, green, blue);
      }

      client.writePixels();
    });
}

var time = 0;

function drawnew(default_leds) {
  redis_client.mget(['background_color','background_on','wave_color','wave_on'], function(err, reply) {  
    background_color = reply[0];
    background_on = (reply[1] === true);
    wave_color = reply[2];
    wave_on = (reply[3] === true);
    client.setPixelCount(5120);

      if(background_color == null){
        background_color = "#0055FF";
      }

      var bg_R = hexToR(background_color);
      var bg_G = hexToG(background_color);
      var bg_B = hexToB(background_color);

      if(wave_color == null){
        wave_color = "#0055FF";
      }

    leds = JSON.parse(default_leds);
    for (var pixel = 0; pixel < leds.length; pixel++){
      led = leds[pixel];

      var w_R = hexToR(wave_color);
      var w_G = hexToG(wave_color);
      var w_B = hexToB(wave_color);
      var w_hsv = RGBtoHSV(w_R,w_G,w_B);
      var w_h = w_hsv.h;
      var w_s = w_hsv.s;
      var w_v = w_hsv.w; 
    
      w_s = w_s * (Math.sin((led.x+time)/ 100) +2);
      w_v = w_v * (Math.sin((led.x+time)/ 100) + 1.2);
      var w_rgb = HSVtoRGB(w_h,w_s,w_v);
      w_R = w_rgb.r;
      w_G = w_rgb.g;
      w_B = w_rgb.b;
      client.setPixel(pixel, w_R, w_G, w_B);
      if(w_s + w_v < 1){
        client.setPixel(pixel, bg_R, bg_G, bg_B);
      }
    }
    client.writePixels();
    time++;
  });
}

redis_client.mget(['default_leds'], function(err, reply) {
  default_leds = reply[0];


  setInterval(function(){draw(default_leds)}, 100);
});

var color_math = require('./color_math.js');
