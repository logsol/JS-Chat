var http = require('http'), io = require('socket.io');
var server = http.createServer();
server.listen(9999);

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

