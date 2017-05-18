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

        obj.populate = function (d, filter) {
			var list = obj.get('list');
            list.emptyCollection();
			data =d;
            var keys = Object.keys(d).filter(function (k) {
                return filter(k, d);
            });
            var total = 0;
            var cardTotal = 0;
            keys.forEach(function (k) {
				if (!(d[k].type === 'BONUS' && d[k].value<0)) {
					total += d[k].value;
				}
				if (d[k].type === 'BONUS') {
					cardTotal += d[k].value;
				}
            });
            list.populate('transaction', keys);
            cjs.Component.parse('currency', cardTotal, obj.get('card-total'));
            cjs.Component.parse('currency', total, obj.get('total'));
        };

        obj.refresh = function (e) {
            var total = 0;
            e.data.keys.forEach(function (k) {
                total += data[k].value;
            });
            cjs.Component.parse('currency', total, obj.get('total'));
        };

		obj.removeItem = function (id) {
			obj.get('list').removeItem(id);
		};

        return obj;
    }

}
