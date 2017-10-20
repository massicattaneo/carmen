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

        obj.initialise = function() {

		};

		obj.add = function(id, info, count) {
			data[id] = info;
			obj.get('list').addItemByInfo('transaction', id, info, count);
		};

		obj.updateItem = function (info, id) {
			data[id] = info;
			obj.get('list').updateItem(info, id);
		};

		obj.empty = function () {
			data = {};
			obj.get('list').emptyCollection()
		};

        obj.refresh = function (e) {
            var total = 0;
			var cardTotal = 0;
			var selectedTotal = 0;
			e.data.keys.forEach(function (k) {
				if (!(data[k].cardId && data[k].value<0)) {
					total += data[k].value;
				}
				if (data[k].cardId) {
					cardTotal += data[k].value;
				}
				if (data[k].toPrint) {
					selectedTotal += data[k].value;
				}
            });
            cjs.Component.parse('currency', total, obj.get('total'));
			cjs.Component.parse('currency', cardTotal, obj.get('card-total'));
			cjs.Component.parse('currency', selectedTotal, obj.get('selected-total'));
			cjs.Component.parse('currency', selectedTotal - (selectedTotal / ((100 + config.IVA) / 100)), obj.get('iva-total'));

		};

		obj.removeItem = function (id) {
			obj.get('list').removeItem(id);
		};

        return obj;
    }

}
