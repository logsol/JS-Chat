function Connector(ip, port){
  this.ip = ip;
  this.port = port;
  this.connect(ip, port);
}

Connector.prototype.connect = function(ip, port){
  this._socket = new WebSocket("ws://"+ip+":"+port);
  console.log(this._socket);
  this._socket.onopen = function(){
    alert('socket is opened.');
  }
}

$(function () {
  var chat = new Connector('fuuuuu.de', 80);
});

