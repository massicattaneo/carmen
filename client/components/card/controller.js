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

		obj.update = function (info) {
			var date = new cjs.Date(info.created);
			obj.get('name').setValue(info.name);
			obj.get('user').setValue(info.user);
			cjs.Component.parse('short-date', info.created, obj.get('created'));
		};

        return obj;
    }

}
