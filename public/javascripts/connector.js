function Connector(){
    this.ip = null;
    this.port = null;
    this.socket = null;
}

Connector.prototype.connect = function(ip, port){
    var self = this;
    this.ip = ip;
    this.port = port;
  
    if(window.io === undefined){
        self.onError('io not found (chatserver seems down)');
        return false;
    }

    this.socket = io.connect(this.ip + ':' + this.port);
    this.socket.reconnecting = false;
}

Connector.prototype.registerEvent = function(name, callback){
    this.socket.on(name, callback);
}

Connector.prototype.send = function(method, data){
    var transfer = {
        method: method,
        data: data
    };
    transfer = JSON.stringify(transfer);
    this.socket.send(transfer);
    console.log('sending: ' + transfer);
}

Connector.prototype.onError = function(message){
    console.log(message);
}