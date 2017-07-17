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

    var template = imports('components/print/template.html');
    var style = imports('components/print/style.scss');

    return function (config) {

        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		obj.init = function () {
			obj.get('filter-bill-from').get().valueAsDate = new Date();
			obj.get('filter-bill-to').get().valueAsDate = new Date();
			obj.get('filter-day-from').get().valueAsDate = new Date();
			obj.get('filter-day-to').get().valueAsDate = new Date();
		}

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
		};

		obj.printList = function () {
			var dateFrom = new Date(obj.get('filter-day-from').getValue());
			dateFrom.setHours(0,0,0,0);
			var dateTo = new Date(obj.get('filter-day-to').getValue());
			dateTo.setHours(23,59,59,999);
			obj.get().fire('tap-print-list', function (item) {
				if (dateFrom.getTime() > item.created) return false;
				if (dateTo.getTime() < item.created) return false;
				return true;
			})
		};

		obj.printBills = function () {
			var dateFrom = new Date(obj.get('filter-bill-from').getValue());
			dateFrom.setHours(0,0,0,0);
			var dateTo = new Date(obj.get('filter-bill-to').getValue());
			dateTo.setHours(23,59,59,999);
			obj.get().fire('tap-print-bills', {
				filter: function (item) {
					if (dateFrom.getTime() > item.created) return false;
					if (dateTo.getTime() < item.created) return false;
					if (item.type !== 'tarjeta credito') return false;
					if (item.value < 0) return false;
					return true;
				},
				start: obj.get('billNumber').getValue()
			})
		};

        return obj;

    }

};
