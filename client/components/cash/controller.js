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

    var template = imports('components/cash/template.html');
    var style = imports('components/cash/style.scss');

    return function (config) {
        
        var c = cjs.Component({
            template: template,
            style: style,
            config: config
        });

        c.open = function (clientData) {
            c.get('name').setValue(clientData.name);
            c.get('surname').setValue(clientData.surname);
            c.get('email').setValue(clientData.email);
            c.get('tel').setValue(clientData.tel);
        };

        c.refresh = function (e) {
            
        };

        return c;

    }

};
