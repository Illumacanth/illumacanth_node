/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
      function HSVtoRGB(h, s, v) {
	    var r, g, b, i, f, p, q, t;
	    if (arguments.length === 1) {
		s = h.s, v = h.v, h = h.h;
	    }
	    i = Math.floor(h * 6);
	    f = h * 6 - i;
	    p = v * (1 - s);
	    q = v * (1 - f * s);
	    t = v * (1 - (1 - f) * s);
	    switch (i % 6) {
		case 0: r = v, g = t, b = p; break;
		case 1: r = q, g = v, b = p; break;
		case 2: r = p, g = v, b = t; break;
		case 3: r = p, g = q, b = v; break;
		case 4: r = t, g = p, b = v; break;
		case 5: r = v, g = p, b = q; break;
	    }
          return {
              r: Math.round(r * 255),
              g: Math.round(g * 255),
              b: Math.round(b * 255)
          };
      };

/* accepts parameters
 * r  Object = {r:x, g:y, b:z}
 * OR 
 * r, g, b
*/
function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
};
     
      Math.radians = function(degrees) {
          return degrees * Math.PI / 180;
      };
      Math.degrees = function(radians) {
          return radians * 180 / Math.PI;
      };

module.exports = {

      var LED = function(x, y, z, hue, saturation, lightness) {
          this.x = x;
          this.y = y;
          this.z = z;
          this.hue = hue;
          this.saturation = saturation;
          this.lightness = lightness;
          this.color();
      }
}
      LED.prototype.color = function() {
          return "hsl(" + this.hue.toString() + "," + this.saturation.toString() + "%," + this.lightness.toString() + "%)";
      }
      var LEDlist = [];

      function colorCircle(x1, y1, radius, LEDlist) {
          for (var i = 0; i < LEDlist.length; i++) {
              var led = LEDlist[i];
              var x2 = led.x;
              var y2 = led.y;
              var distance = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
              led.hue = 230;
              //    led.hue = (led.hue + (distance / radius) * 360 | 0) / 2;
              //    led.saturation += (distance / radius) * 100 | 0;
              led.saturation = 100;
              led.lightness = (distance / radius) * 100 | 0;
          }
      }

      function randomizeLEDColors(LEDlist) {
          for (var i = 0; i < LEDlist.length; i++) {
              led = LEDlist[i];
              led.hue = Math.floor(Math.random() * 360);
              led.saturation = 100;
              led.lightness = 60;
              //    led.saturation += Math.floor(Math.random()*100);
              //    led.lightness += Math.floor(Math.random()*100);
          }
      }

      function setBackgroundColor(hue, saturation, lightness, LEDlist) {
          for (var i = 0; i < LEDlist.length; i++) {
              var led = LEDlist[i];
              led.hue = hue;
              led.saturation = saturation;
              led.lightness = lightness;
          }
      }
      var Show = function(patternList, LEDlist) {
          this.time = 0;
          this.patternList = patternList;
          this.LEDlist = LEDlist;
      }
      Show.prototype.updateAll = function(time) {
          for (var l = 0; l < this.LEDlist.length; l++) {
              LED = this.LEDlist[l];
              LED.saturation = 0;
              LED.lightness = 0;
              for (var p = 0; p < patternList.length; p++) {
                if(patternList[p].on == true){
                  pattern = this.patternList[p];
                  if(LED.saturation + LED.lightness < 50){
                    LED.hue = pattern.getHue(LED.x, LED.y, time);
                    LED.saturation = pattern.getSaturation(LED.x,LED.y,time);
                    LED.lightness = pattern.getLightness(LED.x,LED.y,time);
                  }
                }
              }
          }
      }
      var bgColor = function() {
          this.hue;
          this.saturation;
          this.lightness;
          this.on = true;
          this.kind = "bgcolor";
      }
      bgColor.prototype.getHue = function(x, y, time) {
          return this.hue;
      }
      bgColor.prototype.getSaturation = function(x, y, time) {
          return this.saturation;
      }
      bgColor.prototype.getLightness = function(x, y, time) {
          return this.lightness;
      }
      bgColor.prototype.setColor = function() {
          hsl = t.toHsl();
          this.hue = hsl.h;
          this.saturation = hsl.s * 100;
          this.lightness = hsl.l * 100;
      }
      var Waves = function() {
          this.hue = 270;
          this.saturation = 100;
          this.value = 100;
          this.on = true;
          this.kind = "waves";
      }
      Waves.prototype.getHue = function(x, y, time) {
          return this.hue;
      }
      Waves.prototype.getSaturation = function(x, y, time) {
          return this.saturation * (Math.sin((x+time)/ 100) +2);
      }
      Waves.prototype.getLightness = function(x, y, time) {
          var light = this.lightness * (Math.sin((x+time)/ 100) + 1.2);
          return light;
      }
      Waves.prototype.setColor = function() {
          hsl = t.toHsl();
          this.hue = hsl.h;
          this.saturation = hsl.s * 100;
          this.lightness = hsl.l * 100;
      }
      var patternList = [];
      var thisWaves = new Waves();
      patternList.push(thisWaves);
      var thisBGColor = new bgColor();
      patternList.push(thisBGColor);
      var currentShow = new Show(patternList, LEDlist);
      var time = 0.0;
      setInterval(function() {
          time = time + 10;
      }, 100)

