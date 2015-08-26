var canvas = document.getElementById('LED_map');
var context = canvas.getContext('2d');
var x = x_position.valueAsNumber;
var y = y_position.valueAsNumber;
var z = z_position.valueAsNumber;
var default_data = "";

var LEDlist = [];

var Ring = function (x,y,z,count) {
  this.x        = x;
  this.y        = y;
  this.z        = z;
  this.count    = count;
  this.shape     = "ring";
  this.radius = this.update_radius();
  var canvas = document.getElementById('LED_map');
  var context = canvas.getContext('2d');
  this.context  = context;
};

Ring.prototype.draw = function() {
  this.radius = this.update_radius();
  drawRing(this.x,this.y,this.count,this.radius,this.context);
};

Ring.prototype.points = function() {
  this.radius = this.update_radius();
  return ringPoints(this.x,this.y,this.count,this.radius);
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

var Line = function (x,y,z) {
  this.x        = x;
  this.y        = y;
  this.z        = z;
  this.count    = 64;
  this.shape    = "line";
  this.length   = 444;
  var canvas = document.getElementById('LED_map');
  var context = canvas.getContext('2d');
  this.context  = context;
}

Line.prototype.draw = function() {
  drawLine(this.x,this.y,this.count,this.length,this.context);
}

Line.prototype.points = function() {
  return linePoints(this.x,this.y,this.count,this.length);
};

function addRing (LEDlist) {
  x = x_position.valueAsNumber;
  y = y_position.valueAsNumber;
  var e = document.getElementById("count");
  count = parseInt(e.options[e.selectedIndex].value);
  var z = 0;
  ring = new Ring(x,y,z,count);
  LEDlist.push(ring);
  drawCanvas(LEDlist);
};

function addLine (LEDlist,x,y) {
  line = new Line(x_position.valueAsNumber,y_position.valueAsNumber,z);
  LEDlist.push(line);
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
  save_element_list();
}

function drawRing(centerX,centerY,count,ring_radius,context) {
  for (var i = 0; i < count; i++) {
      var angle = i * 2 * Math.PI / count;
      context.beginPath();
      context.arc(centerX-ring_radius * Math.sin(angle), centerY -ring_radius * Math.cos(angle), 3, 0, 2 * Math.PI, false)
      context.fillStyle = 'red';
      context.fill();
  }
}

function ringPoints(centerX,centerY,count,radius){
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

function drawLine(startx,starty,count,length,context){
  for (var i = 0; i < count; i++) {
    context.beginPath();
    context.arc(startx, starty + i, 3, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
  }
}

function linePoints(startx,starty,count,length){
  var model = [];
  var index = 0;

  for (var i = 0; i < count; i++) {
    model[index++] = {
      point: [startx, starty + i, 0]
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

function element_interface (index, LED) {
  var box_string = LED.shape + " " + LED.count;
  box_string += "<SPAN style='color:red' class = 'delete_led' id = '" + index;
  box_string += "' onclick = 'delete_element(" + index + ")'>";
  box_string += " delete </SPAN><BR>";
  return box_string;
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
}

function save_element_list() {
  $.ajax({
    method: "POST",
    url: "/save_layout",
    data: { default_layout: JSON.stringify(LEDlist) }
  }).done(function( msg )
  {});
}
