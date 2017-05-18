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

        obj.populate = function (componentName, keys) {
            keys.forEach(function (key, index) {
                obj.addItem(componentName, key, index + 1);
            });
        };

        obj.emptyCollection = function () {
            items.each(function (i,k,o) {
                o.remove()
            });
            items.clear();
        };

		obj.each = function (callback) {
			items.each(callback);
		};

        obj.addItem = function (componentName, id, count) {
            var c = cjs.Component.create(componentName, {config: {id: id, count: count}});
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
            var filter = items.filter(function (c) {
                return c.get().getValue().toLowerCase().indexOf(filterText)!== -1
            });

            items.forEach(function (c) {c.get().removeStyle('visible')});
            if (!filter.isEmpty()) {
                filter.forEach(function (k) {
                    k.get().addStyle('visible')
                })
            } else if (!filter.size() && filterText === '') {
                items.forEach(function (c) {
                    c.get().addStyle('visible')
                });
            }
            obj.get().fire('refresh', {keys: filter.keysToArray(), filterText: filterText});
        };

        return obj;
    }

}
