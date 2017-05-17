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
		};

		obj.genericBuy = function () {
			transactionMultiplier = -1;
			obj.get('client-data').addStyle({display: 'none'});
			obj.get('payer-name').setValue('');
		};

		obj.saveTransaction = function (e) {
			e.preventDefault();
			var data = {
				value: transactionMultiplier * parseFloat(obj.get('value').getValue()),
				type: obj.get('type').getValue(),
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
