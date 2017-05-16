/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: controller
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function controller(imports) {

    var template = imports('components/history/template.html');
    var style = imports('components/history/style.scss');

    return function (config) {

        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

        obj.populate = function (id, clientData,a, data) {
            obj.get('name').setValue(clientData.name);
            obj.get('surname').setValue(clientData.surname);
            obj.get('email').setValue(clientData.email);
            obj.get('tel').setValue(clientData.tel);
            return obj.get('transaction-list').populate(data, function (k) {
                return k.toString() === id.toString();
            });
        };

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
		};

        return obj;

    }

}
