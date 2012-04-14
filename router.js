
/*
 * GET home page.
 */

function getHostName(host){
    return host.match(/^([^:]*)/)[1];
}

exports.route = function(req, res){
    
    var host = getHostName(req.headers.host);
    var socketPort = 9999;
    
    res.render('index', {
        title: 'Chat', 
        host: host,
        socketPort: socketPort,
        socketJavascriptFile: 'http://' + host + ':' + socketPort + '/socket.io/socket.io.js'
    });
};
