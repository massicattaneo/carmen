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

		obj.update = function (info) {
			cjs.Component.parse('short-date', info.created, obj.get('created'));
			obj.get('type').setValue(info.type);
			cjs.Component.parse('transactionType', info.cardId, obj.get('cardId'));
			obj.get('name').setValue(info.name);
			obj.get('description').setValue(info.description);
			cjs.Component.parse('currency', info.value, obj.get('value'));
			obj.get('user').setValue(info.user);
		};

        return obj;
    }

}
