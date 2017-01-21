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
        var clients = cjs.Collection();

        obj.populate = function () {
            var n = cjs.Need([]);
            var defer = cjs.Need();
            var clients;
            config.db.once('clients/', function (data) {
                clients = data.exportVal();
                Object.keys(data.val()).forEach(function (key) {
                    n.add(obj.addItem(key))
                });
                if (n.size() === 0) n.add(cjs.Need().resolve());
            });
            n.done(function () {
                defer.resolve(clients);
            })
            return defer;
        };

        obj.addItem = function (id) {
            var c = cjs.Component.create('client', {config: {id: id}});
            clients.add(c, id);
            c.createIn(obj.get('collection').get());
            return cjs.Component.collectData();
        };

        obj.removeItem = function (id) {
            clients.get(id.toString()).remove();
        };

        obj.editItem = function (id, client) {
            clients.get(id.toString()).showEdit(id, client);
        };

        obj.filter = function () {
            var filterText = obj.get('filter').getValue().toLowerCase();
            var all = obj.get('collection').children().filter(function (c) {
                return c.get().nodeType === 1
            });

            var filter = all.filter(function (c) {
                return c.getValue().toLowerCase().indexOf(filterText)!== -1
            });

            all.forEach(function (c) {
                c.removeStyle('visible')
            });
            if (filter.length) {
                filter.forEach(function (c) {
                    c.addStyle('visible')
                })
            } else if (!filter.length && filterText === '') {
                all.forEach(function (c) {
                    c.addStyle('visible')
                });
            }
            obj.get().fire('refresh', {empty: !filter.length && filterText !== '' });
        };

        return obj;
    }

}