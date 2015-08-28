

var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});


var express = require('express');

var server = express();
server.use(express.static(__dirname + '/public'));

var port = 10101;

server.listen(port, function() {
    console.log('server listening on port ' + port);
});

app.post('/save', routes.saveTodo);

exports.saveTodo = function(req, res) {
  var newTodo = {};
  newTodo.name = req.body['todo-text'];
  newTodo.id = newTodo.name.replace(" ", "-");
  client.hset("Todo", newTodo.id, newTodo.name);
  res.redirect("back");
};
