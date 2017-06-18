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
		var edit;
		
        obj.showEdit = function (id, client) {
            edit = cjs.Component.create('clientEdit', {config: {buttonText: 'guardar'}});
            edit.createIn(obj.get('client-edit-wrapper'));
            obj.get('client-view-wrapper').addStyle('hidden');
            edit.get('name').setValue(client.name);
            edit.get('surname').setValue(client.surname);
            edit.get('email').setValue(client.email);
            edit.get('tel').setValue(client.tel);
            edit.get().addListener('submit', function () {
				obj.get().fire('tap-client-update', edit.toJSON());
				obj.closeEdit();
            });
        };

		obj.closeEdit = function () {
			if (edit) {
				edit.remove();
				obj.get('client-view-wrapper').removeStyle('hidden');
				edit = undefined;
			}
		};


        return obj;
    }

}
