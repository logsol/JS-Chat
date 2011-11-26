var net = require('net'), 
    crypto = require('crypto');

var server = net.createServer(function (socket) {

  var client = new Client(socket);

  socket.on("data", function(data){
    var data = data.toString();
    
    if(!client.isHandshaken){
      client.isHandshaken = client.handshake(data);
    } else {
      client.receive(data); 
    }
  });
  socket.on("end", function(data){
    console.log('client disconnected');
  });
});

server.listen(9999);

function Client(socket) {
  this.socket = socket;
  this.isHandshaken = false;
}

Client.prototype.handshake = function(request){
console.log(request);
  var key = request.match(/Sec-WebSocket-Key: (.*)\r\n/);
  key = key[1];
  var shasum = crypto.createHash('sha1');
  shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
  key = shasum.digest('base64');

  var responseHeaders = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    "Sec-WebSocket-Accept: " + key,
        ""
  ];
  this.socket.write(responseHeaders.concat('', '').join('\r\n'));
  console.log('client connected');

  return true;
}

Client.prototype.receive = function(data){
  data = new Buffer(data, 'ascii').toString();
  console.log('client receive: ' + data);
}
