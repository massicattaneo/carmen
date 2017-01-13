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

    var template = imports('components/clients/template.html');
    var style = imports('components/clients/style.scss');

    return function (config) {
        
        var c = cjs.Component({
            template: template,
            style: style,
            config: config
        });

        c.populate = function () {
            return c.get('list').populate();
        };

        c.remove = function (id) {
            c.get('list').removeItem(id);
        };

        c.refresh = function (e) {
            if (e.data.key !== undefined) {
                c.get('list').add(e.data.key)
                var listNode = c.get('list').get('filter').get();
                listNode.focus();
                listNode.select();
            }
            if (e.data.empty) {
                c.get('add').removeStyle('hidden')
            } else {
                c.get('add').addStyle('hidden')
            }
        };

        return c;

    }

};
