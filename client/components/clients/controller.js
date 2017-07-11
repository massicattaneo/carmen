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

		c.show = function () {
			c.get().addStyle({display: 'block'});
		};

        c.remove = function (id) {
            c.get('list').removeItem(id);
        };

        c.edit = function (id, client) {
            c.get('list').editItem(id, client);
        };

		c.closeEdit = function () {
			c.get('list').closeEdit()
		};

        c.addClient = function () {
            var addComponent = c.get('client-add');
            addClient(addComponent.toJSON());
            addComponent.emptyForm();
            var listNode = c.get('list').get('filter').get();
            listNode.focus();
            listNode.select();
            c.refresh();
        };

        c.update = function (info, id) {
			c.get('list').updateItem(info, id)
		};

        c.add = function (id, info, count) {
			c.get('list').addItemByInfo('client', id, info, count)
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

        c.enterMode = function (mode) {
			c.get().removeStyle('select');
			switch (mode) {
				case 'select':
					c.get('title').setValue('Seleciona un cliente');
					c.get().addStyle(mode);
					break;
				default:
					c.get('title').setValue(config.clientsText);
					break;
			}
		};

        function addClient(p){
            return config.db.add('clients', {
				user: config.user,
                name: p.name,
                surname: p.surname,
                email: p.email,
                tel: p.tel
            });
        };

        return c;

    }

};
