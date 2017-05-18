/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: main.js
 Created Date: 16 May 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2017.
 //////////////////////////////////////////////////////////////////////////////
 */

import NfcApp from './nfc-reader/index';
import ServerApp from './server/index';

var nfcApp = new NfcApp();
var serverApp = new ServerApp();

nfcApp.on('card-read', function (reader, card, data) {
	serverApp.send(data)
});

serverApp.on('web-socket-message', async (data) => {
	try {
		await nfcApp.write(data.cardId);
		console.log('write done');
	} catch(e) {
		console.log('error', e)
	}
});
