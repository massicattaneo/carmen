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

        var data = {};

        // obj.populate = function (d, filter) {
			// var list = obj.get('list');
        //     list.emptyCollection();
			// data =d;
        //     var keys = Object.keys(d).filter(function (k) {
        //         return filter(k, d);
        //     });
        //     var total = 0;
        //     var cardTotal = 0;
        //     keys.forEach(function (k) {
			// 	if (!(d[k].cardId && d[k].value<0)) {
			// 		total += d[k].value;
			// 	}
			// 	if (d[k].cardId) {
			// 		cardTotal += d[k].value;
			// 	}
        //     });
        //     // list.populate('transaction', keys);
        //     cjs.Component.parse('currency', cardTotal, obj.get('card-total'));
        //     cjs.Component.parse('currency', total, obj.get('total'));
        // };

		obj.add = function(id, info, count) {
			data[id] = info;
			obj.get('list').addItemByInfo('transaction', id, info, count);

			var total = 0;
			var cardTotal = 0;
			var keys = Object.keys(data);
			keys.forEach(function (k) {
				if (!(data[k].cardId && data[k].value < 0)) {
					total += parseFloat(data[k].value);
				}
				if (data[k].cardId) {
					cardTotal += parseFloat(data[k].value);
				}
			});
			cjs.Component.parse('currency', cardTotal, obj.get('card-total'));
			cjs.Component.parse('currency', total, obj.get('total'));
		};

		obj.empty = function () {
			data = {};
			obj.get('list').emptyCollection()
		};

        obj.refresh = function (e) {
            var total = 0;
			var cardTotal = 0;
			e.data.keys.forEach(function (k) {
				if (!(data[k].cardId && data[k].value<0)) {
					total += data[k].value;
				}
				if (data[k].cardId) {
					cardTotal += data[k].value;
				}
            });
            cjs.Component.parse('currency', total, obj.get('total'));
			cjs.Component.parse('currency', cardTotal, obj.get('card-total'));

		};

		obj.removeItem = function (id) {
			obj.get('list').removeItem(id);
		};

        return obj;
    }

}
