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

        var data;

        obj.populate = function (data, filter) {
            var list = obj.get('list');
            list.emptyCollection();
            var keys = Object.keys(data).filter(function (k) {
                return filter(k, data);
            });
            var total = 0;
            keys.forEach(function (k) {
                total += data[k].value;
            });
            list.populate('transaction', keys);
            cjs.Component.parse('currency', total, obj.get('total'));
        };

        obj.refresh = function (e) {
            var total = 0;
            e.data.keys.forEach(function (k) {
                total += data[k].value;
            });
            cjs.Component.parse('currency', total, obj.get('total'));
        };

        return obj;
    }

}