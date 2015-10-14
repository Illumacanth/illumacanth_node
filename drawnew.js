exports.drawnew = function(default_leds) {
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
