var net = require('net');
var util = require('util');

var port = 6666;

var test_work_request = "POST /xml_1.1 HTTP/1.1\r\nUser-Agent: Sirius-CU/1.0 1\r\nContent-Length: 23\r\nContent-Type: text/xml\r\n\r\n<state>{work=1}</state>";
var test_ok_response = "HTTP/1.1 200 OK\r\nServer: Sirius-CU/1.0 1\r\nContent-Length: 6\r\nContent-Type: text/xml\r\n\r\n<OK />";

var server = net.createServer(function(c) {
  console.log('client connected ' + c.remoteAddress + ':' + c.remotePort);

  c.on('end', function() {
    console.log('client disconnected');
  });

  var packet = "";

  c.on('data', function(piece) {
    packet += piece;
    var header_end = packet.indexOf("\r\n\r\n");
    if ( header_end != -1)
    {
    	/* we got headers... */
    	var content_length = 0;
    	var done = false;
    	var result = packet.match(/Content-Length: (\d+)/);
    	if (result != null)
    	{
    		content_length = parseInt(result[1]) ;
    	}
    	console.log('content length is ' + content_length);
    	/* do we have content? */
    	if ( content_length > 0 ) {
    		var content = packet.slice(header_end + "\r\n\r\n".length);
    		console.log('received content: ' + content.length);
    		if (content_length == content.length) {
    			done = true;
    		}
    	}
    	/* request recieved */
    	if ( done == true ) {
    		console.log('request received...');
    		console.log(content);
    		c.write(test_work_request);
    		c.write(test_ok_response);
    	}

     }
  });

});


server.listen(port, function() {
  var serverAddress = server.address();
  console.log( 'server is listening at port ' + serverAddress.address + ':' + serverAddress.port );
});