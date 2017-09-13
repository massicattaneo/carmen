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
			edit = cjs.Component.create('clientEdit', { config: { buttonText: 'guardar' } });
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

		obj.update = function (client, id) {
			obj.get('client-view-wrapper').setAttribute('title', 'ID = ' + id + ', USER = ' + client.user);
			obj.get('name-surname').setAttribute('title', client.name + ' ' + client.surname);
			obj.get('email').setAttribute('title', client.email);
			obj.get('tel').setAttribute('title', client.tel);
			obj.get('name').setValue(client.name);
			obj.get('surname').setValue(client.surname);
			obj.get('email').setValue(client.email);
			obj.get('email').setAttribute('href', 'mailto:' + client.email);
			obj.get('tel').setValue(client.tel);
		};


		return obj;
	}

}
