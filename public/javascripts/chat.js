
var chat = new Connector();

// Methods

chat.run = function(host, port){
    chat.init();
    chat.connect(host, port);
    chat.registerEvents();
};

chat.init = function(){
    $('#chat').hide();
    $('#hint').text('connecting').show();
    $('#output p a').live('click', function(){
        $(this).css('color', 'gray');
    });
    
    $('#username').val('nickname');
}

chat.registerEvents = function(){
    chat.registerEvent('error', chat.onError);
    chat.registerEvent('close', chat.onDisconnect);
    chat.registerEvent('disconnect', chat.onDisconnect);
    
    chat.registerEvent('connect', chat.onConnect);
    chat.registerEvent('login', chat.onLogin);
    chat.registerEvent('message', chat.onMessage);
    chat.registerEvent('list', chat.onList);
}

chat.output = function(text){
    var p = $('<p></p>').text(text);
    p.html(chat.linkify(p.text()));
    $('#output').append(p);
    $("#output").animate({scrollTop: $("#output").prop('scrollHeight')}, "slow");
}

chat.login = function(){
    var name = $("#username").attr('value');
    
    chat.send('login', {
        name: name,
        channel: 'lobby'
    });
};

chat.message = function(message){
    if($.trim(message) !== ''){
        chat.send('message', {
            text: message
        });
    }
}


// Events

chat.onError = function(data){
    data = JSON.parse(data);
    $('#hint').text('ERROR: ' + data.message);
};

chat.onClose = function(){
    $('#hint').text('disconnected');
};
  
chat.onConnect = function(){
    $('#chat').show('slow');
    $('#hint').text('connected');
    $('#username').focus();
    $('#username').select();
    $('#join').click(chat.login);
    $('#username').keyup(function (e){
        if(e.keyCode == 13){
            chat.login();
        }
    });
};

chat.onLogin = function(data) {
    data = JSON.parse(data);
    if(data.success){
        $('#login').hide('slow');
        $('#message').show('slow');
        $('#text').focus();
        
        $('#text').keyup(function (e){
            if(e.keyCode == 13){
                chat.message($('#text').val());
                $('#text').val('');
                $('#text').focus();
            }
        });
        $('#send').click(function(){
            chat.message($('#text').val());
            $('#text').val('');
            $('#text').focus();
        });
    }
}

chat.onMessage = function(data){
    data = JSON.parse(data);
    chat.output(data.from + ': ' + data.text);
}
  
chat.onList = function(data){
    data = JSON.parse(data);
    $('#users').empty();
    $.each(data.list, function(index, user){
        $('#users').append($('<li>').text(user));
    });
}

