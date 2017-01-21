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
        var items = cjs.Collection();

        obj.populate = function (componentName, itemsToAdd) {
            Object.keys(itemsToAdd).forEach(function (key) {
                obj.addItem(componentName, key);
            });
        };

        obj.addItem = function (componentName, id) {
            var c = cjs.Component.create(componentName, {config: {id: id}});
            items.add(c, id);
            c.createIn(obj.get('collection').get());
            return cjs.Component.collectData();
        };

        obj.removeItem = function (id) {
            var key = id.toString();
            items.get(key).remove();
            items.remove(key);
        };

        obj.editItem = function (id, client) {
            items.get(id.toString()).showEdit(id, client);
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