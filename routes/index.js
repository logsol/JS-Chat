
/*
 * GET home page.
 */

function getHostName(host){
  return host.match(/^([^:]*)/)[1];
}

exports.index = function(req, res){
    
  console.log(req.headers.host, getHostName(req.headers.host));
    
  var host = getHostName(req.headers.host);
  var socketPort = 9999;
    
  res.render('index', {
    title: 'Express', 
    host: host,
    socketPort: socketPort,
    socketJavascriptFile: 'http://' + host + ':' + socketPort + '/socket.io/socket.io.js'
  })
};
