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
		var audio = cjs.Audio();
		audio.init(audioConfig);

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

		var history = History(config);
		history.createIn(document.getElementById('page'));

		var cash = Cash(config);
		cash.createIn(document.getElementById('page'));

		var transactionAdd = cjs.Component.create('transaction-add', {});
		transactionAdd.createIn(document.getElementById('page'));

		var blackScreen = BlackScreen(config);
		blackScreen.createIn(document.body);
		document.body.className = '';

		var popUpDeleteClient = PopUp(cjs.Object.extend({ type: 'delete-client' }, config), document.body);
		var popUpDeleteTransaction = PopUp(cjs.Object.extend({ type: 'delete-transaction' }, config), document.body);
		var popUpDeleteCard = PopUp(cjs.Object.extend({ type: 'delete-card' }, config), document.body);

		var staticData = { clientsData, transactionsData, cardsData };
		var nfcReader = cjs.Component({template: '<div/>',style: '.& {display: none}'});

		var sm = new StateMachine(useCases, staticData, {
			header, blackScreen, clients, users, history, cash,
			settings, popUpDeleteClient, popUpDeleteTransaction,popUpDeleteCard,
			transactionAdd, cards, nfcReader,
			db: {
				updateClients: function (info, id) {
					db.update('clients/' + id, info);
				},
				deleteClients: function (id) {
					db.remove('clients/' + id);
				},
				deleteTransactions: function (id) {
					db.remove('transactions/' + id);
				},
				saveTransaction: function (id, data) {
					db.add('transactions', {
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
						description: data.description,
						name: data.name,
						value: data.value,
						type: data.type
					});
				},
				saveCard: function (id) {
					db.add('cards', {
						clientId: id,
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
						cash.remove(data.key)
					});
				},
				loadClients: function () {
					return db.onChange('clients', function (data) {
						Object.assign(clientsData, data);
						data && clients.populate(data);
					})
				},
				loadCards: function () {
					return db.onChange('cards', function (data) {
						Object.assign(cardsData, data);
						data && cards.populate(data);
					})
				},
				loadTransactions: function () {
					return db.onChange('transactions/', function (data) {
						Object.assign(transactionsData, data);
						data && cash.update(data);
					})
				},
				hideAllPages: function () {
					clients.get().addStyle({ display: 'none' });
					cards.get().addStyle({ display: 'none' });
					transactionAdd.get().addStyle({ display: 'none' });
					cash.get().addStyle({ display: 'none' });
					users.get().addStyle({ display: 'none' });
					history.get().addStyle({ display: 'none' });
					settings.get().addStyle({ display: 'none' });
				},
				writeCard: function (cardId) {
					webSocket.send(JSON.stringify({cardId: cardId}));
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
						return a+b;
					}))
				},
				print: function (list) {
					var doc = new jsPDF('p', 'mm', [297, 210]);
					var linesHeight = 6;
					var x = 0;
					var y = 0;
					var numOFLinesPErPAge = 30;

					var total = 0;

					list.forEach(function (b, i) {
						if (!(b.type === 'BONUS' && b.value<0)) {
							total += b.value;
						}
						if (i % numOFLinesPErPAge === 0) {
							y = 20;
							i!==0 && doc.addPage();
						}
						y += linesHeight;
						doc.setFontSize(12);
						// doc.setFontType("italic");
						doc.text(b.type, x+7, y);
						doc.text(b.name, x+40, y);
						doc.text(b.description, x+100, y);
						doc.text(cjs.Component.parse('currency', b.value), x+170, y);

						// doc.setFontType("bold");
						// doc.setFontSize(20);
						// doc.text('POSTO PRENOTATO', x+28, y+20);
						// doc.setFontSize(12);
						// doc.setFontType("normal");
						// doc.text('Sig.:' + b.name, x+28, y+29);
					});
					doc.setFontType("bold");
					doc.text('TOTAL', x+100, y+10);
					doc.text(cjs.Component.parse('currency', total), x+170, y+10);


					doc.save('report.pdf');
				}
			}
		});

		webSocket.onmessage = function(event){
			nfcReader.get().fire('card-detect', event.data);
		};

		sm.enter('start-app');

	};

}
