
var http = require('http')
    , io = require('socket.io');
  
var server = http.createServer()
    , socket = io.listen(server)
    , clients = {}
    , channels = {}
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
    clients[link.id] = {
        id: link.id,
        name: null,
        login: false,
        link: link,
        channel: null
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
        emit(client, 'error', {message: error});
    }
}

function emit(to, method, data){
    data = JSON.stringify(data);
    to.link.emit(method, data);
}

function message(to, text, from){
    
    var match, leavingChannel;
    
    if(match = text.match(/\/nick (.*)/)) {
        broadcast(from.channel, from.name + ' is now called ' + match[1]);
        from.name = match[1];
        emitListUpdate(from.channel);
        return;
    }
    
    if(match = text.match(/\/join (.*)/)) {
        if(match[1] == from.channel.name) return;
        leavingChannel = from.channel;
        broadcast(leavingChannel, from.name + ' has gone to ' + match[1]);
        joinChannel(from, match[1]);
        emitListUpdate(leavingChannel);
        return;
    }
    
    from = (from === undefined || from === null) 
        ? 'server' 
        : from.name;
    
    emit(to, 'message', {
        text: text,
        from: from
    });
}

function broadcast(channel, text, from){
    for(var x  in channel.clients){
        message(channel.clients[x], text, from);
    }
}

function emitListUpdate(channel){
    var list = [];
    for(var x  in channel.clients){
        if(channel.clients[x].login) list.push(channel.clients[x].name);
    }
    for(x in channel.clients){
        emit(channel.clients[x], 'list', {
            list: list
        });
    }
}

function joinChannel(client, channelName){
    var channel, clients;
    
    if(client.channel){
        delete client.channel.clients[client.id];
    }
    
    if(channels[channelName]){
        channel = channels[channelName];
        channel.clients[client.id] = client;
    } else {
        clients = {};
        clients[client.id] = client;
        channel = {
            name: channelName,
            clients: clients
        }
        channels[channelName] = channel;
    }
    client.channel = channel;
    
    emitListUpdate(client.channel); 
    broadcast(client.channel, 'Welcome to ' + client.channel.name + ', ' + client.name + '!');
}

// Events

function onLogin(client, data){
    client.name = data.name;
    client.login = true;
    joinChannel(client, data.channel);
    emit(client, 'login', {
        success: client.login
    });
}

function onMessage(from, data){
    if(from.login){
        broadcast(from.channel, data.text, from);
    }
}

function onDisconnect(link){
    var client;
    for(var x in clients){
        if(clients[x].link === link){
            client = clients[x];
            delete clients[x];
            break;
        }
    }
    if(client.login){   
        emitListUpdate(client.channel);
        broadcast(client.channel = client.name + ' has left.');
    }
}
