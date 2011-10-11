var net = require('net');

var server = net.createServer(function (socket) {
  socket.on("data", function(data){
    console.log("- received some data: \r\n" + data.toString());

    responseHeaders = "HTTP/1.1 101 Switching Protocols\r\n" 
      + "Upgrade: WebSocket\r\n"
      + "Connection: Upgrade\r\n"
      + "WebSocket-Origin: null\r\n"
      + "WebSocket-Location: ws://fuuuuu.de:80/\r\n"
      + "\r\n";

    socket.write(responseHeaders);
    console.log("- writing to socket:\r\n" + responseHeaders);
  });
});

server.listen(80, "fuuuuu.de");

