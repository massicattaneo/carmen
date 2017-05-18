/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: index
 Created Date: 16 May 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2017.
 //////////////////////////////////////////////////////////////////////////////
 */
import EventEmitter from 'events';
import http  from 'http';
import fs from 'fs';
import path from 'path';

export default class ServerApp extends EventEmitter {

	constructor() {
		super();
		const server = http.createServer((request, response) => {

			let filePath;
			if (request.url.indexOf('bower_components/') !== -1) {
				filePath = '.' + request.url;
			} else if (request.url.indexOf('server/') !== -1) {
				filePath = '.' + request.url;
			} else {
				filePath = './client' + request.url;
			}
			const extname = String(path.extname(filePath)).toLowerCase();
			let contentType = 'text/html';
			const mimeTypes = {
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

			fs.readFile(filePath, (error, content) =>{
				if (error) {
					if(error.code == 'ENOENT'){
						fs.readFile('./404.html', (error, content) => {
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

		const WebSocketServer = require('websocket').server;

		const socket = new WebSocketServer({
			httpServer: server
		});

		let connection;

		socket.on('request', (request) => {
			connection = request.accept(null, request.origin);

			//send message
			//connection.sendUTF('this is a websocket example');

			connection.on('message', (message) => {
				this.emit('web-socket-message', JSON.parse(message.utf8Data));
			});

			connection.on('close', (connection) => {
				console.log('connection closed');
			});
		});

		this.send = (msg) => {
			connection.sendUTF(msg);
		};

		console.log('Server running at http://127.0.0.1:8081/');
	}

}
