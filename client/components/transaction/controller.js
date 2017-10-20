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

        obj.showEdit = function (id, client) {

        };

		obj.update = function (info, id) {
			obj.get().get().id = id;
			obj.get('toPrint').setAttribute('disabled', info.type !== 'efectivo' ? 'disabled' : undefined);
			obj.get('toPrint').get().checked = info.toPrint;
			obj.get('wrapper').setAttribute('title', 'ID = ' + id + ', USER = ' + info.user);
			obj.get('created').setAttribute('title', cjs.Component.parse('short-date', info.created));
			obj.get('type').setAttribute('title', info.type);
			obj.get('name').setAttribute('title', info.name);
			obj.get('description').setAttribute('title', info.description);
			cjs.Component.parse('short-date', info.created, obj.get('created'));
			obj.get('type').setValue(info.type);
			cjs.Component.parse('transactionType', (info.cardId && info.transactionId) || (info.cardId && info.value<0), obj.get('cardId'));
			obj.get('name').setValue(info.name);
			obj.get('description').setValue(info.description);
			cjs.Component.parse('currency', info.value, obj.get('value'));
			obj.get('user').setValue(info.user);
		};

		obj.changeSelected = function (e) {
			obj.get().fire('transaction-change-print', {id: obj.get().get().id, checked: obj.get('toPrint').get().checked});
		};

        return obj;
    }

}
