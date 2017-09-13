/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: bootstrap.js
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function boostrap(imports) {
	var Header = imports('components/header/controller.js');
	var BlackScreen = imports('components/black-screen/controller.js');
	// var Calendar = imports('components/calendar/controller.js');
	var Settings = imports('components/settings/controller.js');
	var Print = imports('components/print/controller.js');
	var Users = imports('components/users/controller.js');
	var Clients = imports('components/clients/controller.js');
	var Cards = imports('components/cards/controller.js');
	var Cash = imports('components/cash/controller.js');
	var History = imports('components/history/controller.js');
	var PopUp = imports('components/pop-up/controller.js');
	var config = imports('js/config.json');
	var register = imports('js/register.js');
	var audioConfig = imports('sounds/config.json');
	var useCases = imports('use-cases/use-cases.xml');
	var StateMachine = imports('js/state-machine.js');

	return function (db, webSocket) {
		var clientsData = {};
		var transactionsData = {};
		var cardsData = {};
		// var audio = cjs.Audio();
		// audio.init(audioConfig);
		config.audioPlayer = {
			play: function () {
			}, mute: function () {
			}, unmute: function () {
			}
		};

		config.db = db;
		register(config);

		var header = Header(config);
		header.createIn(document.getElementById('header'));

		// var calendar = Calendar(config);
		// calendar.createIn(document.getElementById('page'));

		var settings = Settings(config);
		settings.createIn(document.getElementById('page'));

		var users = Users(config);
		users.createIn(document.getElementById('page'));

		var clients = Clients(config);
		clients.createIn(document.getElementById('page'));

		var cards = Cards(config);
		cards.createIn(document.getElementById('page'));

		var transactionAdd = cjs.Component.create('transaction-add', {});
		transactionAdd.createIn(document.getElementById('page'));

		var history = History(config);
		history.createIn(document.getElementById('page'));

		var cash = Cash(config);
		cash.createIn(document.getElementById('page'));
		cash.initialise();

		var print = Print(config);
		print.createIn(document.getElementById('page'));
		print.initialise();

		var blackScreen = BlackScreen(config);
		blackScreen.createIn(document.body);

		settings.initSettings();

		var popUpDeleteClient = PopUp(cjs.Object.extend({ type: 'delete-client' }, config), document.body);
		var popUpDeleteTransaction = PopUp(cjs.Object.extend({ type: 'delete-transaction' }, config), document.body);
		var popUpDeleteCard = PopUp(cjs.Object.extend({ type: 'delete-card' }, config), document.body);

		var staticData = { clientsData, transactionsData, cardsData, config };
		var nfcReader = cjs.Component({ template: '<div/>', style: '.& {display: none}' });

		function newTot(goal, startArray) {
			var array = startArray
				.filter(b => b.type === "efectivo")
				.sort((a,b) => a.created - b.created);
			var res = [];
			var counter = -1;
			var start = 0;
			var length = array.length;
			var comparer = [];
			while (res.length < length) {
				if (comparer.indexOf((new cjs.Date(array[++counter].created)).format('dd-mm-yy'), start) === -1) {
					comparer.push((new cjs.Date(array[counter].created)).format('dd-mm-yy'));
					res.push(array.splice(counter, 1)[0]);
				}
				if (counter >= array.length-1) {
					counter = -1;
					start = res.length;
				}
			}
			return res.reduce(function (a, b) {
				var tot = a.reduce((a,b) => a + b.value, 0);
				if (tot + b.value <= goal) a.push(b);
				return a;
			}, [])
		}

		var sm = new StateMachine(useCases, staticData, {
			header, blackScreen, clients, users, history, cash,
			settings, print, popUpDeleteClient, popUpDeleteTransaction, popUpDeleteCard,
			transactionAdd, cards, nfcReader,
			db: {
				updateClients: function (info, id) {
					db.update('clients/' + id, info);
					clients.update(info, id);
				},
				deleteClients: function (id) {
					db.remove('clients/' + id);
				},
				deleteTransactions: function (id) {
					db.remove('transactions/' + id);
				},
				saveTransaction: function (id, data) {
					db.add('transactions', {
						user: config.user,
						description: data.description,
						clientId: id,
						cardId: data.cardId,
						name: data.name,
						value: data.value,
						type: data.type
					});
				},
				saveBuy: function (data) {
					db.add('transactions', {
						user: config.user,
						description: data.description,
						name: data.name,
						value: data.value,
						type: data.type
					});
				},
				saveCard: function (id) {
					db.add('cards', {
						clientId: id,
						user: config.user,
						name: clientsData[id].name + ' ' + clientsData[id].surname + ' - tel: ' + clientsData[id].tel
					});
				},
				deleteCard: function (id) {
					db.remove('cards/' + id);
				}
			},
			utils: {
				init: function () {
					db.onRemove('clients', function (data) {
						delete clientsData[data.key];
						clients.remove(data.key)
					});
					db.onRemove('transactions', function (data) {
						delete transactionsData[data.key];
						cash.remove(data.key)
					});
					db.onRemove('cards', function (data) {
						delete cardsData[data.key];
						cards.remove(data.key)
					});
				},
				loadClients: function () {
					firebase.database().ref('clients/').on('child_added', function (d) {
						clientsData[d.key] = d.val();
						clients.add(d.key, d.val(), Object.keys(clientsData).length)
					});
					firebase.database().ref('clients/').on('child_changed', function (d) {
						clientsData[d.key] = d.val();
					});
				},
				loadCards: function () {
					firebase.database().ref('cards/').on('child_added', function (d) {
						cardsData[d.key] = d.val();
						cards.add(d.key, d.val(), Object.keys(cardsData).length)
					});
				},
				loadTransactions: function () {
					firebase.database().ref('transactions/').on('child_added', function (d) {
						transactionsData[d.key] = d.val();
						if (cjs.Date.isToday(d.val().created)) {
							cash.add(d.key, d.val(), Object.keys(transactionsData).length)
						}
					});
				},
				backupDb: function () {
					setTimeout(function () {
						var string = JSON.stringify({
							cards: cardsData,
							clients: clientsData,
							transactions: transactionsData
						});
						string.match(/.{1,100}/g).map(function (str, i, arr) {
							if (i === arr.length - 1) return '@@' + str;
							return '##' + str;
						}).forEach(function (str) {
							webSocket.send(str);
						});
					}, 5000);
				},
				hideAllPages: function () {
					clients.get().addStyle({ display: 'none' });
					cards.get().addStyle({ display: 'none' });
					transactionAdd.get().addStyle({ display: 'none' });
					cash.get().addStyle({ display: 'none' });
					users.get().addStyle({ display: 'none' });
					history.get().addStyle({ display: 'none' });
					settings.get().addStyle({ display: 'none' });
					print.get().addStyle({ display: 'none' });
				},
				writeCard: function (cardId) {
					webSocket.send(JSON.stringify({ cardId: cardId }));
					nfcReader.get().fire('card-detect', cardId);
				},
				getClientFromCard: function (cardId) {
					return cjs.Need().resolve(cardsData[cardId].clientId)
				},
				calculateCardTotal: function (cardId) {
					var filter = Object.keys(transactionsData).map(function (key) {
						return transactionsData[key]
					}).filter(function (t) {
						return t.cardId === cardId;
					}).map(function (t) {
						return t.value
					});
					if (!filter.length) return cjs.Need().resolve(0);
					return cjs.Need().resolve(filter.reduce(function (a, b) {
						return a + b;
					}))
				},
				printList: function (filter) {
					var doc = new jsPDF('p', 'mm', [297, 210]);
					var linesHeight = 6;
					var x = 0;
					var y = 0;
					var numOFLinesPErPAge = 40;
					var total = 0;
					Object.keys(transactionsData)
						.map(function (k) {
							return transactionsData[k];
						})
						.filter(filter)
						.forEach(function (b, i) {
							if (!(b.cardId && b.value < 0)) {
								total += b.value;
								if (i % numOFLinesPErPAge === 0) {
									y = 20;
									i !== 0 && doc.addPage();
								}
								y += linesHeight;
								doc.setFontSize(10);
								doc.text(b.type, x + 7, y);
								doc.text(b.name.substr(0, 30), x + 40, y);
								doc.text(b.description.substr(0, 30), x + 100, y);
								doc.text(cjs.Component.parse('currency', b.value), x + 170, y);
							}

						});
					doc.setFontType("bold");
					doc.text('TOTAL', x + 100, y + 10);
					doc.text(cjs.Component.parse('currency', total), x + 170, y + 10);

					doc.output('save', 'listado.pdf');
				},
				printCards: function (filter) {
					var doc = new jsPDF('p', 'mm', [297, 210]);
					var linesHeight = 6;
					var x = 0;
					var y = 0;
					var numOFLinesPErPAge = 40;
					var total = 0;
					Object.keys(cardsData)
						.filter(function (k) {
							return filter(cardsData[k])
						})
						.forEach(function (cardId, i) {
							var transactions = Object.keys(transactionsData)
								.map(function (k) {
									return transactionsData[k]
								})
								.filter(function (o) {
									return o.cardId === cardId
								});
							var tt = 0;
							if (transactions.length) {
								tt = transactions.map(function (o) {
									return o.value;
								}).reduce(function (a, b) {
									return a + b;
								})
							}

							total += tt;
							if (i % numOFLinesPErPAge === 0) {
								y = 20;
								i !== 0 && doc.addPage();
							}
							y += linesHeight;
							doc.setFontSize(10);
							doc.text(cardsData[cardId].name, x + 7, y);
							doc.text(cjs.Component.parse('currency', tt), x + 190, y, 'right');
							doc.text('(' + transactions.length + ')', x + 200, y, 'right');
						});
					doc.setFontType("bold");
					doc.text('TOTAL', x + 100, y + 10);
					doc.text(cjs.Component.parse('currency', total), x + 190, y + 10, 'right');
					doc.output('save', 'tarjetas.pdf');
				},
				printClients: function (filter) {
					var doc = new jsPDF('p', 'mm', [297, 210]);
					var linesHeight = 6;
					var x = 0;
					var y = 0;
					var numOFLinesPErPAge = 40;
					var total = 0;
					Object.keys(clientsData)
						.filter(function (k) {
							return filter(clientsData[k])
						})
						.forEach(function (clientId, i) {
							var transactions = Object.keys(transactionsData)
								.map(function (k) {
									return transactionsData[k]
								})
								.filter(function (o) {
									return o.clientId === clientId && filter(o)
								});
							var tt = 0;
							if (transactions.length) {
								tt = transactions.map(function (o) {
									return o.value;
								}).reduce(function (a, b) {
									return a + b;
								})
							}

							if (tt > 0) {
								total += tt;
								if (i % numOFLinesPErPAge === 0) {
									y = 20;
									i !== 0 && doc.addPage();
								}
								y += linesHeight;
								doc.setFontSize(10);
								doc.text(clientsData[clientId].name + ' ' + clientsData[clientId].surname, x + 7, y);
								doc.text(cjs.Component.parse('currency', tt), x + 190, y, 'right');
								doc.text('(' + transactions.length + ')', x + 200, y, 'right');
							}
						});
					doc.setFontType("bold");
					doc.text('TOTAL', x + 100, y + 10);
					doc.text(cjs.Component.parse('currency', total), x + 190, y + 10, 'right');
					doc.output('save', 'clients.pdf');
				},
				printBills: function (params) {
					var doc = new jsPDF('p', 'mm', [297, 210]);
					var startNumber = Number(params.start) || 1;
					var cashIds = newTot(params.cashMaximum, Object.keys(transactionsData)
						.map(function (k) {return transactionsData[k];})
						.filter(params.filter));
					console.log(cashIds)
					Object.keys(transactionsData)
						.map(function (k) {
							return transactionsData[k];
						})
						.filter(function (item) {
							return params.filter(item) && (item.type === 'tarjeta credito' || cashIds.filter(i => i.created === item.created).length > 0)
						})
						.forEach(function (b, i) {
							i !== 0 && doc.addPage();
							var txtImage = 'data:image/jpeg;base64,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';
							doc.addImage(txtImage, 'JPEG', 5, 0, 90, 50);

							doc.rect(110, 15, 90, 30, 'S');
							doc.setFontSize(20);
							doc.setFontStyle('bold');
							doc.text('FACTURA', 120, 25);
							doc.setFontStyle('italic');
							doc.setFontSize(8);
							doc.text('CLIENTE:', 120, 35);
							doc.setFontStyle('normal');
							doc.setFontSize(12);
							doc.rect(120, 27, 70, 0, 'S');
							doc.text(b.name.toUpperCase(), 120, 42);

							doc.text('Numero: ' + (startNumber + i), 10, 60);
							var date = new cjs.Date(b.created);
							doc.text('Fecha: ' + date.format('dd/mm/yyyy'), 50, 60);
							doc.rect(10, 62, 90, 0, 'S');

							doc.setFontSize(8);
							var start = 80;
							doc.text('Codigo', 10, start);
							doc.text('Descripcion', 30, start);
							doc.text('Base Imponible', 150, start, 'right');
							doc.text('% IVA', 175, start, 'right');
							doc.text('Importe', 200, start, 'right');
							doc.setFontSize(12);
							start += 10;
							doc.text('1', 10, start);
							(b.description + '  ').match(/(.{1,33}\s)\s*/g).forEach(function (line, i) {
								doc.text(line, 30, start + (i * 5));
							});
							var netNumber = b.value * ((100 - config.IVA) / 100);
							var net = new cjs.Currency(netNumber);
							var iva = new cjs.Currency(b.value - netNumber);
							doc.text(net.format('i.ff s'), 150, start, 'right');
							doc.text(config.IVA.toString() + '%', 175, start, 'right');
							var tot = new cjs.Currency(b.value);
							doc.text(tot.format('i.ff s'), 200, start, 'right');


							// doc.rect(130, 250, 70, 25, 'S');
							doc.text('BASE IMPONIBLE', 140, 240, 'right');
							doc.text(net.format('i.ff s'), 190, 240, 'right');
							doc.text('%', 140, 247, 'right');
							doc.text('21%', 190, 247, 'right');
							doc.text('IVA', 140, 254, 'right');
							doc.text(iva.format('i.ff s'), 190, 254, 'right');
							doc.setFontSize(16);
							doc.text('TOTAL', 140, 265, 'right');
							doc.text(tot.format('i.ff s'), 190, 265, 'right');

							doc.rect(10, 235, 190, 0, 'S');

							doc.setFontSize(10);
							doc.text('HIDIME BELLEZA S.L.', 10, 240);
							doc.text('Calle Salitre 11, 29002 Malaga', 10, 245);
							doc.text('NIF: B93140986', 10, 250);

						});

					doc.output('save', 'facturas.pdf');
				},
				logout: function () {
					cash.initialise();
				}
			}
		});

		webSocket.onmessage = function (event) {
			nfcReader.get().fire('card-detect', event.data);
		};

		sm.enter('start-app');

	};

}
