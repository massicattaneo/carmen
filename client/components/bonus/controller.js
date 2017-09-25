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

		obj.update = function (info, id) {
			// obj.get().get().id = id;
			// obj.get('wrapper').setAttribute('title', 'ID = ' + id + ', USER = ' + info.user);
			// obj.get('name').setAttribute('title', info.name);
			// var date = new cjs.Date(info.created);
			// obj.get('name').setValue(info.name);
			// obj.get('user').setValue(info.user);
			// cjs.Component.parse('short-date', info.created, obj.get('created'));
		};

		obj.useBonus = function (e) {
			e.preventDefault();
			e.stopPropagation();
			var {transactionId, clientName, cardId, clientId} = config.data;
			var data ={
				value: parseFloat(obj.get('value').getValue()),
				type: 'utilizo bonus',
				cardId: cardId,
				clientId: clientId,
				transactionId: transactionId,
				toPrint: false,
				name: clientName,
				description: obj.get('description').getValue()
			};
			obj.get().fire('transaction-add', data);
		};

        return obj;
    }

}
