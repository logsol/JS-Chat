
/**
 * Module dependencies.
 */

var express = require('express')
    , router = require('./router')
    , chat = require('./chat');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes

app.get('*', router.route);

app.listen(8888);
chat.run(9999);

console.log("All up and running in %s mode", app.settings.env);
console.log("HTTP port: %s", app.address().port);
console.log("Socket port: %s", chat.port);
