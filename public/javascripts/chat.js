function Connector(ip, port){
  this.ip = ip;
  this.port = port;
  this._socket = null;
}

Connector.prototype.connect = function(callback){
  var self = this;
  
  if(window.io === undefined){
    self.onError('Unable to connect. Could not load io.');
    return false;
  }

  this._socket = io.connect(this.ip + ':' + this.port);

  this._socket.on('connect', function(){
    console.log('socket is opened.');
    callback(true);
  });

  this._socket.on('message', function(data){
    self.onReceiveMessage('user', data);
  });

  this._socket.on('close', function(e){
    console.log('_socket.onclose', e);
  });
}
Connector.prototype._send = function(method, data){
  this._socket.send(method + ":" + data);
  console.log("sending: " + method + ":" + data);
}
Connector.prototype.login = function(name, callback){
  this._send("login", name);
  var that = this;
}
Connector.prototype.message = function(message){
  this._send('message', message);
}
Connector.prototype.onUpdateUsers = function(users){}
Connector.prototype.onReceiveMessage = function(user, message){}
Connector.prototype.onError = function(message){}

var chat = function(host, port){
  var con = new Connector(host, port);
  con.onError = function(message){
    console.log(message);
  }
  con.connect(function(){
    $('#join').click(function(){
      con.login($("#username").attr('value'), function(success){
        if(success){
          $('#login').hide();
          $('#message').show();
          $('#send').click(function(){
            con.message($('#text').attr('value'));
          });
        }else{
          alert('sorry, login failed');
        }
      });
    });
  });
  con.onUpdateUsers = function(users){
    $('#users').empty();
    $.each(users, function(index, value){
      $('#users').append($('<li>').text(value));
    });
  }
  con.onReceiveMessage = function(user, message){
    console.log(message);
    $('#output').text($('#output').text() + user + ": " + message + "\n");
  }
};

