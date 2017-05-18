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
			obj.get('card-id').setAttribute('value', cardId);
			obj.get('extra-info').setValue('Total residuo de la tarjeta: ' + cardTotal);
			obj.get().addStyle('bonus-mode');
		};

		obj.saveTransaction = function (e) {
			e.preventDefault();
			var cardId = obj.get('card-id').getValue();
            var data = {
				value: transactionMultiplier * parseFloat(obj.get('value').getValue()),
				type: cardId === '' ? obj.get('type').getValue() : 'BONUS',
				cardId: cardId,
				name: obj.get('payer-name').getValue(),
				description: obj.get('description').getValue()
			};
			obj.get().fire('transaction-add', data)
		};

		obj.show = function () {
			obj.get().addStyle({ display: 'block' });
		};

        return obj;
    }

}
