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

        c.populate = function (data) {
            c.get('list').emptyCollection();
            var keys = Object.keys(data).map(function (key) {return key;});
            c.get('list').populate('client', keys);
        };

        c.remove = function (id) {
            c.get('list').removeItem(id);
        };

        c.update = function (id, client) {

        };

        c.edit = function (id, client) {
            c.get('list').editItem(id, client);
        };

        c.addClient = function () {
            var addComponent = c.get('client-add');
            var key = addClient(addComponent.toJSON());
            addComponent.emptyForm();
            c.get('list').addItem('client', key);
            var listNode = c.get('list').get('filter').get();
            listNode.focus();
            listNode.select();
            c.refresh();
        };

        c.refresh = function (e) {
            var isEmpty = false;
            if (e && e.data && e.data.keys) isEmpty = e.data.keys.length === 0  && e.data.filterText !== '' ;
            if (isEmpty) {
                c.get('add').removeStyle('hidden')
            } else {
                c.get('add').addStyle('hidden')
            }
        };

        function addClient(p){
            return config.db.add('clients', {
                name: p.name,
                surname: p.surname,
                email: p.email,
                tel: p.tel
            });            
        };

        return c;

    }

};
