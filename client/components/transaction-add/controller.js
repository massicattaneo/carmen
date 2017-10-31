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
		var transactionMultiplier = 1;
		var storeClientId;

		function reset() {
			obj.get().removeStyle('bonus-mode');
			obj.get('title').setValue('PAGO');
			obj.get('save').setAttribute('disabled');
			obj.get('created').get().valueAsDate = new Date();
		}

		obj.addClientData = function (clientId, clientsData) {
			transactionMultiplier = 1;
			reset();
			var data = clientsData[clientId];
			storeClientId = clientId;
			obj.get('client-data').addStyle({display: 'block'});
			obj.get('name').setValue(data.name);
			obj.get('surname').setValue(data.surname);
			obj.get('email').setValue(data.email);
			obj.get('tel').setValue(data.tel);
			obj.get('payer-name').setValue(data.name + ' ' + data.surname);
			obj.get('card-id').setAttribute('value', '');
		};

		obj.genericBuy = function () {
			transactionMultiplier = -1;
			reset();
			obj.get('title').setValue('COMPRA');
			obj.get('client-data').addStyle({display: 'none'});
			obj.get('payer-name').setValue('');
			obj.get('card-id').setAttribute('value', '');
		};

		obj.bonusMode = function (cardId) {
			reset();
			transactionMultiplier = 1;
			obj.get('card-id').setAttribute('value', cardId);
			obj.get('title').setValue('ANADE BONUS');
			obj.get().addStyle('bonus-mode');
		};

		obj.saveTransaction = function (e) {
			e.preventDefault();
			var cardId = obj.get('card-id').getValue();
			var value = transactionMultiplier * parseFloat(obj.get('value').getValue());
			var type = ((!cardId) || value>=0) ? obj.get('type').getValue() : 'utilizo bonus';
			var created = new Date(obj.get('created').getValue());
			var data = {
				value: value,
				type: type,
				cardId: cardId,
				toPrint: type === 'tarjeta credito',
				name: obj.get('payer-name').getValue(),
				description: obj.get('description').getValue(),
				clientId: storeClientId,
				created: created.getTime()
			};
			obj.get().fire('transaction-add', data)
		};

		obj.check = function () {
			var value = parseFloat(obj.get('value').getValue());
			value = isNaN(value) ? 0 : value;
			obj.get('save').setAttribute('disabled', (value < 0) ? 'disabled' : undefined);
		};

		obj.show = function () {
			obj.get().addStyle({ display: 'block' });
		};

		obj.resetData = function () {
			transactionMultiplier = 1;
			obj.get('client-data').addStyle({display: 'block'});
			obj.get('name').setValue('');
			obj.get('surname').setValue('');
			obj.get('email').setValue('');
			obj.get('tel').setValue('');
			obj.get('value').get().value = '';
			obj.get('type').get().selectedIndex = 0;
			obj.get('description').get().value = '';
			obj.get('payer-name').setValue('');
			obj.get('card-id').setAttribute('value', '');
			reset();
		};

        return obj;
    }

}
