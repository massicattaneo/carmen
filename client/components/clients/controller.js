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

        c.edit = function (id) {
            c.get('list').editItem(id);
        };

        c.addClient = function () {
            var addComponent = c.get('client-add');
            var key = addClient(addComponent.toJSON());
            addComponent.emptyForm();
            c.get('list').addItem(key);
            var listNode = c.get('list').get('filter').get();
            listNode.focus();
            listNode.select();
            c.refresh();
        };

        c.refresh = function (e) {
            e = e || {data: {}};
            if (e.data.empty) {
                c.get('add').removeStyle('hidden')
            } else {
                c.get('add').addStyle('hidden')
            }
        };

        function addClient(p){
            var storesRef = config.db.get('clients');
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                name: p.name,
                surname: p.surname,
                email: p.email,
                tel: p.tel
            });
            return newStoreRef.key;
        }

        return c;

    }

};
