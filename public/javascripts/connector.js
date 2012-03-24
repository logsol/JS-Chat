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

// utility

Connector.prototype.linkify = function(text){
    if (text) {
        text = text.replace(
            /((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
            function(url){
                var full_url = url;
                if (!full_url.match('^https?:\/\/')) {
                    full_url = 'http://' + full_url;
                }
                return '<a href="' + full_url + '" target="_blank">' + url + '</a>';
            }
        );
    }
    return text;
}