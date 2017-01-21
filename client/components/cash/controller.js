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

        c.populate = function (clientData, id) {
            var defer = cjs.Need();
            c.get('name').setValue(clientData.name);
            c.get('surname').setValue(clientData.surname);
            c.get('email').setValue(clientData.email);
            c.get('tel').setValue(clientData.tel);
            config.db.once('clients/', function (data) {
                var keys = Object.keys(data.val())
                    .map(function (key) {return key;})
                    .filter(function (key) {
                        return key.toString() === id.toString();
                    });
                c.get('list').populate('transaction', keys);
                defer.resolve(data.val());
            });
            return defer;
        };

        c.refresh = function (e) {

        };

        return c;

    }

};
