var canvas = document.getElementById('LED_map');
var context = canvas.getContext('2d');
var x = x_position.valueAsNumber;
var y = y_position.valueAsNumber;
var default_data = "";

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};


var Ring = function (x,y,count,fc,LEDlist) {
  this.x        = x;
  this.y        = y;
  this.count    = count;
  this.fc       = fc;
  this.index    = total_fc(LEDlist,fc) 
  this.shape     = "ring";
  this.radius = this.update_radius();
  var canvas = document.getElementById('LED_map');
  var context = canvas.getContext('2d');
  this.context  = context;
};

Ring.prototype.draw = function() {
  var color = "green";
  if(selected_fc == this.fc && selected_index == this.index){
    color = "blue";
  }
  this.radius = this.update_radius();
  drawRing(this.x,this.y,this.count,this.radius,this.context,color);
};

Ring.prototype.points = function() {
  this.radius = this.update_radius();
  return ringPoints(this.x,this.y,this.count,this.radius,this.fc);
};

Ring.prototype.update_radius = function() {
  var radius = 19;
  switch (this.count){
    case 7:
      radius = 1;
    case 12:
      radius = 15;
      break;
    case 16:
      radius = 19;
      break;
    case 24:
      radius = 30;
      break;
    case 60:
      radius = 75;
      break;
    default:
      radius = 19;
  }
  return radius;
}

var Line = function (x,y,angle,fc,LEDlist) {
  this.x        = x;
  this.y        = y;
  this.count    = 64;
  this.shape    = "line";
  this.length   = 444;
  this.angle    = angle;
  this.fc       = fc;
  this.index    = total_fc(LEDlist,fc);
  var canvas = document.getElementById('LED_map');
  var context = canvas.getContext('2d');
  this.context  = context;
}

Line.prototype.draw = function() {
  var color = "red";
  if(selected_fc == this.fc && selected_index == this.index){
    color = "blue";
  }
  drawLine(this.x,this.y,this.count,this.length,this.angle,this.context,color);
}

Line.prototype.points = function() {
  return linePoints(this.x,this.y,this.angle,this.count,this.length,this.fc);
};

function total_fc(LEDlist,fc){
  var index = 0;
  for(var i=0; i<LEDlist.length; i++) {
    if(LEDlist[i].fc == fc){index = index + 1}
  }
  return index;
};

function compare(element1,element2){
  if(element1.fc < element2.fc){
    return -1;
  }else if(element1.fc > element2.fc){
    return 1;
  }else if(element1.fc == element2.fc){
    if(element1.index < element2.index){
      return -1;
    }else if(element1.index > element2.index){
      return 1;
    }else if(element1.index == element2.index){
      return 0;
    }
  }else {
    return 0; //you shouldn't get here
  }
};

function addRing (LEDlist) {
  x = x_position.valueAsNumber;
  y = y_position.valueAsNumber;
  var e = document.getElementById("count");
  count = parseInt(e.options[e.selectedIndex].value);
  var fselect = document.getElementById("fadecandy");
  fc = parseInt(fselect.options[fadecandy.selectedIndex].value);
  ring = new Ring(x,y,count,fc,LEDlist);
  LEDlist.push(ring);
  LEDlist.sort(compare);
  drawCanvas(LEDlist);
};

function addLine (LEDlist,x,y) {
  var fselect = document.getElementById("fadecandy");
  fc = parseInt(fadecandy.options[fadecandy.selectedIndex].value);
  line = new Line(x_position.valueAsNumber,y_position.valueAsNumber,orientation.valueAsNumber,fc,LEDlist);
  LEDlist.push(line);
  LEDlist.sort(compare);
  drawCanvas(LEDlist);
}

function outputUpdate() {
  drawCanvas(LEDlist);
}

function outputJSON() {
  var JSON_strings = [];
  $.each(LEDlist, function(index,value) {
    JSON_strings = JSON_strings.concat(value.points());
  });
  return JSON.stringify(JSON_strings);
}

function drawCanvas(LEDlist){
  var c = document.getElementById("LED_map");
  var context = c.getContext("2d");

  var centerX = x_position.valueAsNumber;
  var centerY = y_position.valueAsNumber;
  var angle = orientation.valueAsNumber;

  context.clearRect(0, 0, canvas.width, canvas.height);

//  var img=document.getElementById("#image");
//  context.drawImage(img,10,10,150,180);

  for(var i = 0; i < LEDlist.length; i++){
    LEDlist[i].draw();
  }

  var current_angle = orientation.valueAsNumber;

  drawCross(centerX,centerY,context);
  drawArrow(centerX,centerY - 10,current_angle,context);

  update_element_list(LEDlist);
}

function drawRing(centerX,centerY,count,ring_radius,context,color) {
  for (var i = 0; i < count; i++) {
      var angle = i * 2 * Math.PI / count;
      context.beginPath();
      context.arc(centerX-ring_radius * Math.sin(angle), centerY -ring_radius * Math.cos(angle), 3, 0, 2 * Math.PI, false)
      context.fillStyle = color;
      context.fill();
  }
}

function ringPoints(centerX,centerY,count,radius,fc){
  var model = [];
  var index = 0;

  for (var i = 0; i < count; i++) {
      var angle = i * 2 * Math.PI / count;
      model[index++] = {
          point: [ -radius * Math.sin(angle) + centerX, -radius * Math.cos(angle) + centerY, 0 ]
      };
  }

  return model;
}

function drawLine(startx,starty,count,length,angle,context,color){
  var r = Math.radians((180 - angle)%360);
  x_f = Math.sin(r);
  y_f = Math.cos(r);
  for (var i = 0; i < count; i++) {
    
    context.beginPath();
    context.arc(startx + (i*x_f), starty + (i*y_f), 3, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
  }
}

function linePoints(startx,starty,angle,count,length,fc){
  var model = [];
  var index = 0;
  var r = Math.radians((180 - angle)%360);

  x_f = Math.sin(r);

  y_f = Math.cos(r);
  for (var i = 0; i < count; i++) {
    model[index++] = {
      point: [startx + (i*x_f), starty + (i*y_f), 0, fc]
    }
  }
  return model;
}

function drawCross(centerx,centery,context){
  size = 6;
  context.beginPath();
  context.moveTo(centerx,centery + size);
  context.lineTo(centerx,centery - size);
  context.moveTo(centerx + size,centery);
  context.lineTo(centerx - size,centery);
  context.stroke();
}

function drawArrow(x,y,orientation,context){
  size = 10;
  context.beginPath();
  context.save();
  context.translate(x,y);
  context.rotate(orientation*Math.PI/180);
  context.moveTo(0,0);
  context.lineTo(0, -size);
  context.lineTo(-size/2,-size/2);
  context.lineTo(size/2,-size/2);
  context.lineTo(0,-size);
  context.restore();
  context.stroke();
}

var selected_index = "1000";
var selected_fc = "1000";

function element_interface (index, LED, LEDlist) {
  var box_string = "";
  box_string += "<SPAN style='color:blue;"
  if(LED.index == selected_index && LED.fc == selected_fc){
    box_string += "background-color:#AAAAFF "
    console.log("gothere"); 
  }
  console.log(selected_index + " " + selected_fc);
  box_string += "' class = 'expand_led' id = '" + index + "'"
  box_string += " onclick = 'expand_element(" + index + ")'"
  box_string += " > "
  box_string += LED.shape + " " + LED.count + " " + LED.fc + "-" + LED.index;
  box_string += "</SPAN>";
  box_string += "<SPAN style='color:red' class = 'delete_led' id = '" + index;
  box_string += "' onclick = 'delete_element(" + index + ")'>";
  box_string += " delete </SPAN><BR>";
  return box_string;
}

function expand_element (index) {
  console.log(index);
  LED = LEDlist[index];
  selected_index = LED.index;
  selected_fc = LED.fc;
  update_element_list();
  drawCanvas(LEDlist);
}

function delete_element (LED) {
  LEDlist.splice(LED,1);
  update_element_list();
  drawCanvas(LEDlist);
}

function update_element_list() {
    $("#element_list").empty();
    $.each(LEDlist, function(index, LED) {
        $("#element_list").append(element_interface(index, LED, LEDlist) );
    });
    save_element_list();
    save_leds();
}

function save_element_list() {
  $.ajax({
    method: "POST",
    url: "/save_layout",
    data: { default_layout: JSON.stringify(LEDlist) }
  }).done(function( msg )
  {});
}

function save_leds() {
  $.ajax({
    method: "POST",
    url: "/save_leds",
    data: { default_leds: outputJSON()}
  }).done(function( msg )
  {});
}
