
var http = require('http')
    , io = require('socket.io');
  
var server = http.createServer()
    , socket = io.listen(server)
    , clients = {}
    , self = this
    , eventMap = {
        login: onLogin,
        message: onMessage
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
        onDisconnect(link);
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

function message(to, text, from){
    from = (from === undefined || from === null) 
        ? 'server' 
        : from.name;
    
    emit(to, 'message', {
        text: text,
        from: from
    });
}

function broadcast(text, from){
    for(var x  in clients){
        message(clients[x], text, from);
    }
}

function list(){
    var list = [];
    for(var x  in clients){
        if(clients[x].login) list.push(clients[x].name);
    }
    for(x in clients){
        emit(clients[x], 'list', {
            list: list
        });
    }
}

// Events

function onLogin(client, data){
    client.name = data.name;
    client.login = true;
    emit(client, 'login', {
        success: client.login
    });
    list(); 
    broadcast('Welcome ' + client.name + '!');
}

function onMessage(from, data){
    broadcast(data.text, from);
}

function onDisconnect(link){
    var name, wasLoggedIn = false;
    for(var x in clients){
        if(clients[x].link === link){
            wasLoggedIn = clients[x].login;
            name = clients[x].name;
            delete clients[x];
            break;
        }
    }
    if(wasLoggedIn){   
        list();
        broadcast(name + ' has left.');
    }
}