/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: index
 Created Date: 16 May 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2017.
 //////////////////////////////////////////////////////////////////////////////
 */
export default class ServerApp {

	constructor() {
		var http = require('http');
		var fs = require('fs');
		var path = require('path');

		var server = http.createServer(function (request, response) {

			var filePath;
			if (request.url.indexOf('bower_components/') !== -1) {
				filePath = '.' + request.url;
			} else if (request.url.indexOf('server/') !== -1) {
				filePath = '.' + request.url;
			} else {
				filePath = './client' + request.url;
			}
			var extname = String(path.extname(filePath)).toLowerCase();
			var contentType = 'text/html';
			var mimeTypes = {
				'.html': 'text/html',
				'.js': 'text/javascript',
				'.css': 'text/css',
				'.json': 'application/json',
				'.png': 'image/png',
				'.jpg': 'image/jpg',
				'.gif': 'image/gif',
				'.wav': 'audio/wav',
				'.mp4': 'video/mp4',
				'.woff': 'application/font-woff',
				'.ttf': 'application/font-ttf',
				'.eot': 'application/vnd.ms-fontobject',
				'.otf': 'application/font-otf',
				'.svg': 'application/image/svg+xml'
			};

			contentType = mimeTypes[extname] || 'application/octet-stream';

			fs.readFile(filePath, function(error, content) {
				if (error) {
					if(error.code == 'ENOENT'){
						fs.readFile('./404.html', function(error, content) {
							response.writeHead(200, { 'Content-Type': contentType });
							response.end(content, 'utf-8');
						});
					}
					else {
						response.writeHead(500);
						response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
						response.end();
					}
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});

		}).listen(8081);

		var WebSocketServer = require('websocket').server;

		var socket = new WebSocketServer({
			httpServer: server
		});

		socket.on('request', function(request) {
			var connection = request.accept(null, request.origin);

			connection.sendUTF('this is a websocket example');

			connection.on('message', function(message) {
				console.log(JSON.parse(message.utf8Data).type);
			});

			connection.on('close', function(connection) {
				console.log('connection closed');
			});
		});

		this.send = (msg) => {
			connection.sendUTF(msg);
		};

		console.log('Server running at http://127.0.0.1:8081/');
	}

}
