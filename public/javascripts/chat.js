
var chat = new Connector();

// Methods

chat.run = function(host, port){
    $('#chat').hide();
    $('#hint').text('connecting').show();
    chat.connect(host, port);
    chat.registerEvents();
};

chat.registerEvents = function(){
    chat.registerEvent('error', chat.onError);
    chat.registerEvent('close', chat.onDisconnect);
    chat.registerEvent('disconnect', chat.onDisconnect);
    
    chat.registerEvent('connect', chat.onConnect);
    chat.registerEvent('login', chat.onLogin);
    chat.registerEvent('message', chat.onMessage);
    chat.registerEvent('users', chat.onUsers);
}

chat.output = function(text){
    $('#output').append($('<p></p>').text(text));
}

chat.login = function(){
    var name = $("#username").attr('value');
    
    chat.send('login', {
        name: name
    });
};

chat.message = function(message){
    chat.send('message', {
        text: message
    });
}


// Events

chat.onError = function(message){
    $('#hint').text('ERROR: ' + message);
};

chat.onClose = function(){
    $('#hint').text('disconnected');
};
  
chat.onConnect = function(){
    $('#chat').show('slow');
    $('#hint').text('connected');
    $('#username').focus();
    $('#join').click(chat.login);
};

chat.onLogin = function(data) {
    data = JSON.parse(data);
    chat.output(data.message);
    if(data.success){
        $('#login').hide();
        $('#message').show();
        
        $('#send').click(function(){
            chat.message($('#text').attr('value'));
        });
    }
}

chat.onMessage = function(data){
    data = JSON.parse(data);
    chat.output(data.text);
}
  
chat.onUsers = function(users){
    $('#users').empty();
    $.each(users, function(index, value){
        $('#users').append($('<li>').text(value));
    });
}
