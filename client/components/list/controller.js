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
            obj.get().fire('listChange', {empty: !filter.length && filterText !== '' })
        };

        return obj;
    }

}