
var http = require('http')
    , io = require('socket.io');

  
var server = http.createServer()
    , socket = io.listen(server)
    , clients = {}
    , self = this
    , eventMap = {
        login: login
    };

exports.run = function(port){
    exports.port = port;
    server.listen(port);    
}

socket.configure('development', function(){
    socket.set('log level', 1);
});

socket.on('connection', function(link){
    register(link);
    link.on('message',function(data){
        process(link, data);        
    });
    link.on('disconnect',function(){
        console.log('Client %s has disconnected', link.id);
    });
});

function register(link){
    console.log('Client %s has connected', link.id);
    clients[link.id] = {
        id: link.id,
        name: null,
        login: false,
        link: link
    };
}

function process(link, packet){
    var client, error;
    
    packet = JSON.parse(packet);
    client = clients[link.id];
    
    if(eventMap[packet.method]){
        eventMap[packet.method](client, packet.data);
    } else {
        error = 'call of undefined method ' + packet.method;
        console.log(error);
        emit(client, 'error', {message: error});
    }
}

function emit(client, method, data){
    data = JSON.stringify(data);
    client.link.emit(method, data);
    console.log('emitting: ', method, data);
}

function login(client, data){
    client.name = data.name;
    client.login = true;
    emit(client, 'login', {
        success: true, 
        message: 'Welcome ' + client.name
    });
}

function message(client, message){
    emit(client, 'message', {
        text: message
    });
}