/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: controller
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function controller() {

	return function (config) {
		var obj = {};
		var totalOfTheCard = 0;
		var buttons = [];
		var lists = [];

		function emptyAll() {
			buttons.forEach(b => b.remove());
			buttons.length = 0;
			lists.forEach(b => b.remove());
			lists.length = 0;
		}

		function reset() {
			obj.get().removeStyle('bonus-mode');
			obj.get('save').setAttribute('disabled');
			totalOfTheCard = 0;
		}

		function createButton(description, id, index, cardId) {
			var text = description.replace('COMPRA BONO DE', '').replace('COMPRA BONO', '').replace('COMPRA', '').trim();
			var button = cjs.Component.create('button', { config: { type: 'change-bonus', text: text, id: id } });
			buttons.push(button);
			button.createIn(obj.get('add-bonus'), 'before');
			button.get().addListener('tap-change-bonus', function (id) {
				buttons.forEach(b => b.get().removeStyle('selected'));
				buttons.filter(b => b.config.id === id.data)[0].get().addStyle('selected');
				lists.forEach(b => b.get().removeStyle('selected'));
				lists.filter(b => b.config.data.transactionId === id.data)[0].get().addStyle('selected');
			});
			index === 0 && button.get().addStyle('selected');
		}

		function createList(data, transactionId, index, cardId) {
			var list = cjs.Component.create('bonus', { config: { data: {
				transactionId, cardId,
				clientId: obj.get('client-id').get().value,
				clientName: obj.get('name').getValue() + ' ' + obj.get('surname').getValue()
			} } });
			lists.push(list);
			list.createIn(obj.get('bonus-lists'));
			Object.keys(data).forEach(function (key, i) {
				list.get('transaction-list').add(key, data[key], i)
			});
			list.get('transaction-list').get('list').filter();
			list.get().addStyle('transaction-list');
			index === 0 && list.get().addStyle('selected');
		}

		obj.setUp = function (clientId, clientsData) {
			reset();
			var data = clientsData[clientId];
			obj.get('name').setValue(data.name);
			obj.get('surname').setValue(data.surname);
			obj.get('email').setValue(data.email);
			obj.get('tel').setValue(data.tel);
			obj.get('client-id').get().value = clientId;
		};

		obj.addBonusesList = function (cardId, data) {
			emptyAll();
			var referenceKey;
			var groups = Object.keys(data).reduce((out, key) => {
				if (data[key].value >= 0) {
					referenceKey = data[key].transactionId || key;
					out[key] = out[key] || {};
					out[referenceKey][key] = data[key];
				} else {
					out[(data[key].transactionId || referenceKey)][key] = data[key];
				}
				return out;
			}, {});
			Object.keys(groups)
				.filter(function (groupKey) {
					var keys = Object.keys(groups[groupKey]);
                    return Math.round(keys.map(k => groups[groupKey][k]).reduce((a, b) => {a += b.value; return a;}, 0)) > 0;
				})
				.forEach(function (groupKey, index) {
				createButton(data[groupKey].description, groupKey, index, cardId);
				createList(groups[groupKey], groupKey, index, cardId);
			});

		};

		obj.saveTransaction = function (e) {
			e.preventDefault();
			var cardId = obj.get('card-id').getValue();
			var value = parseFloat(obj.get('value').getValue());
			var type = 'utilizo bonus';
			var data = {
				value: value,
				type: type,
				cardId: cardId,
				toPrint: type === 'tarjeta credito',
				name: obj.get('payer-name').getValue(),
				description: obj.get('description').getValue()
			};
			obj.get().fire('transaction-add', data)
		};

		obj.show = function () {
			obj.get().addStyle({ display: 'block' });
		};

		obj.resetData = function () {
			obj.get('name').setValue('');
			obj.get('surname').setValue('');
			obj.get('email').setValue('');
			obj.get('tel').setValue('');
			reset();
		};

		return obj;
	}

}
