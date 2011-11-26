function Connector(ip, port){
  this.ip = ip;
  this.port = port;
}

Connector.prototype.connect = function(callback){
  this._socket = new WebSocket("ws://"+this.ip+":"+this.port);
//this._socket = new WebSocket("ws://echo.websocket.org");
  console.log(this._socket);
  this._socket.onopen = function(){
    console.log('socket is opened.');
    callback();
  }
}
Connector.prototype._send = function(method, data){
  this._socket.send(method + ":" + data);
  console.log("sending: " + method + ":" + data);
}
Connector.prototype.login = function(name, callback){
  this._send("login", name);
  var that = this;

  setTimeout(function(){
    callback(true); // login successful?
    that.onUpdateUsers(['hans', 'peter', name])
  }, 500);

  this.onReceiveMessage('peter', 'willkommen ' + name + '!');
}
Connector.prototype.message = function(message){
  this._send('message', message);
  this.onReceiveMessage('you', message);
}
Connector.prototype.onUpdateUsers = function(users){}
Connector.prototype.onReceiveMessage = function(user, message){}

$(function () {
  $('#chat').hide();
  $('#message').hide();

  var chat = new Connector('fuuuuu.de', 9999);
  chat.connect(function(){
    $('#chat').show();
//    $('#join').click(function(){
      chat.login($("#username").attr('value'), function(success){
        if(success){
          $('#login').hide();
          $('#message').show();
          $('#send').click(function(){
            chat.message($('#text').attr('value'));
          });
        }else{
          alert('sorry, login failed');
        }
      });
    });
 // });
  chat.onUpdateUsers = function(users){
    $('#users').empty();
    $.each(users, function(index, value){
      $('#users').append($('<li>').text(value));
    });
  }
  chat.onReceiveMessage = function(user, message){
    $('#output').text($('#output').text() + user + ": " + message + "\n");
  }
});

