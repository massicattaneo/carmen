"use strict";

// #############
// Basic example
// - example reading and writing data on from/to card
// - should work well with any compatible PC/SC card reader
// - tested with Mifare Ultralight cards but should work with many others
// - example authentication for Mifare Classic cards
// #############

import winston from 'winston';
import NFC, { TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from './NFC';
import pretty from './pretty';
import EventEmitter from 'events';

// minilogger for debugging
//
// function log() {
// 	console.log(...arguments);
// }
//
// const minilogger = {
// 	log: log,
// 	debug: log,
// 	info: log,
// 	warn: log,
// 	error: log
// };

export default class NfcApp extends EventEmitter {

	constructor() {
		super();
		const nfc = new NFC(); // const nfc = new NFC(minilogger); // optionally you can pass logger to see internal debug logs

		let readers = [];

		nfc.on('reader', async reader => {

			pretty.info(`device attached`, { reader: reader.name });

			readers.push(reader);

			// needed for reading tags emulated with Android HCE AID
			// see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
			reader.aid = 'F222222222';

			reader.on('card', async card => {


				// standard nfc tags like Mifare
				if (card.type === TAG_ISO_14443_3) {
					// const uid = card.uid;
					pretty.info(`card detected`, { reader: reader.name, card });
				}
				// Android HCE
				else if (card.type === TAG_ISO_14443_4) {
					// process raw Buffer data
					const data = card.data.toString('utf8');
					pretty.info(`card detected`, { reader: reader.name, card: { ...card, data } });
				}
				// not possible, just to be sure
				else {
					pretty.info(`card detected`, { reader: reader.name, card });
				}


				// Notice: reading data from Mifare Classic cards (e.g. Mifare 1K) requires,
				// that the data block must be authenticated first
				// don't forget to fill your keys and types
				// reader.authenticate(blockNumber, keyType, key, obsolete = false)
				// if you are experiencing problems, you can try using obsolete = true which is compatible with PC/SC V2.01
				// uncomment when you need it

				// try {
				//
				// 	const key = 'FFFFFFFFFFFF';
				// 	const keyType = KEY_TYPE_A;
				//
				// 	// we will authenticate block 4, 5, 6, 7 (which we want to read)
				// 	// await Promise.all([0,1,2,3,4,5,6,7,8].map((i) => {
				// 	// 	return reader.authenticate(i, keyType, key)
				// 	// }));
				//
				// 	pretty.info(`blocks successfully authenticated`);
				//
				// } catch (err) {
				// 	pretty.error(`error when authenticating data`, { reader: reader.name, card, err });
				// 	return;
				// }


				// example reading 16 bytes assuming containing 16bit integer
				try {
					const key = 'FFFFFFFFFFFF';
					const keyType = KEY_TYPE_A;
					let ret = "";
					await reader.authenticate(1, keyType, key);
					await reader.authenticate(2, keyType, key);
					const e1 = await reader.read(1, 16);
					const e2 = await reader.read(2, 16);
						ret = (e1.toString('ascii')+e2.toString('ascii')).substr(0,20);
					// pretty.info(`data read`, { reader: reader.name, card, data });
					console.log('here', ret)
					this.emit('card-read', reader, card, ret);

				} catch (err) {
					pretty.error(`error when reading data`, { reader: reader.name, card, err });
				}

			});

			reader.on('error', err => {

				pretty.error(`an error occurred`, { reader: reader.name, err });

			});

			reader.on('end', () => {

				pretty.info(`device removed`, { reader: reader.name });

				delete readers[readers.indexOf(reader)];

				console.log(readers);

			});

		});

		nfc.on('error', err => {
			pretty.error(`an error occurred`, err);
		});

		console.log('nfc reader on');

		this.write = async(cardId) => {
			try {

				// reader.write(blockNumber, data, blockSize = 4)
				// - blockNumber - memory block number where to start writing
				// - data - what to write
				// ! Caution! data.length must be divisible by blockSize

				let reader = readers[0];

				// await Promise.all(byteArray.map((string, i) => {
				// 	let data = Buffer.allocUnsafe(16);
				// 	var number = parseInt(string, 2);
				// 	data.writeInt16BE(number);
				// 	return reader.write(i+4, data);
				// }));

				// for (var id = 1; id <= 1; id++) {
				const key = 'FFFFFFFFFFFF';
				const keyType = KEY_TYPE_A;

				// const data = Buffer.from(, 'ascii');

				const firstBlock = Buffer.allocUnsafe(16);
				firstBlock.write(cardId.substr(0,16), 'ascii');
				await reader.authenticate(1, keyType, key);
				await reader.write(1, firstBlock);
				const secondBlock = Buffer.allocUnsafe(16);
				secondBlock.write(cardId.substr(16,4), 'ascii');
				await reader.authenticate(2, keyType, key);
				await reader.write(2, secondBlock);
				console.log('ok');

				return true;
			} catch (err) {
				return err;
			}
		}
	}

}
