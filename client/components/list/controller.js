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
            var all = obj.get('collection').children().filter(function (c) {
                return c.get().nodeType === 1
            });
            var filter = all.filter(function (c) {
                return c.getValue().indexOf(obj.get('filter').getValue())!== -1
            });

            if (filter.length) {
                all.forEach(function (c) {
                    c.removeStyle('visible')
                });
                filter.forEach(function (c) {
                    c.addStyle('visible')
                })
            } else {
                all.forEach(function (c) {
                    c.addStyle('visible')
                });
            }
        };

        return obj;
    }

}