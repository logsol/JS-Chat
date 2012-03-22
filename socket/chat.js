
var http = require('http')
  , io = require('socket.io');
  
var server = http.createServer();
var socket = io.listen(server);

socket.on('connection', function(client){ 
  client.on('message',function(data){ 
    console.log('Received: ',data);
    client.emit('message', {message: 'back ' + data});
  });
  client.on('disconnect',function(){
    console.log('Client has disconnected');
  });
});


exports.run = function(port){
  server.listen(port);    
}