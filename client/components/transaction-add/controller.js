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

		obj.addClientData = function (clientId, clientsData) {
			transactionMultiplier = 1;
			var data = clientsData[clientId];
			obj.get('client-data').addStyle({display: 'block'});
			obj.get('name').setValue(data.name);
			obj.get('surname').setValue(data.surname);
			obj.get('email').setValue(data.email);
			obj.get('tel').setValue(data.tel);
			obj.get('payer-name').setValue(data.name + ' ' + data.surname);
			obj.get('card-id').setAttribute('value', '');
			obj.get('extra-info').setValue('');
			obj.get().removeStyle('bonus-mode');
		};

		obj.genericBuy = function () {
			transactionMultiplier = -1;
			obj.get().removeStyle('bonus-mode');
			obj.get('client-data').addStyle({display: 'none'});
			obj.get('payer-name').setValue('');
			obj.get('card-id').setAttribute('value', '');
			obj.get('extra-info').setValue('');
		};

		obj.bonusMode = function (cardId, cardTotal) {
			transactionMultiplier = 1;
			obj.get('card-id').setAttribute('value', cardId);
			obj.get('extra-info').setValue('Total residuo de la tarjeta: ' + cardTotal);
			obj.get().addStyle('bonus-mode');
		};

		obj.saveTransaction = function (e) {
			e.preventDefault();
			var cardId = obj.get('card-id').getValue();
			var value = transactionMultiplier * parseFloat(obj.get('value').getValue());
            var data = {
				value: value,
				type: ((!cardId) || value>=0) ? obj.get('type').getValue() : 'utilizo bonus',
				cardId: cardId,
				name: obj.get('payer-name').getValue(),
				description: obj.get('description').getValue()
			};
			obj.get().fire('transaction-add', data)
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
			obj.get('extra-info').setValue('');
			obj.get().removeStyle('bonus-mode');
		};

        return obj;
    }

}
