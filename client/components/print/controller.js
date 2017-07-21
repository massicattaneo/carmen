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

		obj.initialise = function () {
			obj.get('filter-bill-from').get().valueAsDate = new Date();
			obj.get('filter-bill-to').get().valueAsDate = new Date();
			obj.get('filter-list-from').get().valueAsDate = new Date();
			obj.get('filter-list-to').get().valueAsDate = new Date();
			obj.get('filter-bill-salitre').get('checkbox').get().checked = localStorage.getItem('user') === 'salitre';
			obj.get('filter-bill-compania').get('checkbox').get().checked = localStorage.getItem('user') === 'compania';
			obj.get('filter-list-salitre').get('checkbox').get().checked = localStorage.getItem('user') === 'salitre';
			obj.get('filter-list-compania').get('checkbox').get().checked = localStorage.getItem('user') === 'compania';
			obj.get('filter-cards-salitre').get('checkbox').get().checked = localStorage.getItem('user') === 'salitre';
			obj.get('filter-cards-compania').get('checkbox').get().checked = localStorage.getItem('user') === 'compania';
			obj.get('filter-clients-salitre').get('checkbox').get().checked = localStorage.getItem('user') === 'salitre';
			obj.get('filter-clients-compania').get('checkbox').get().checked = localStorage.getItem('user') === 'compania';
		};

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
		};

		obj.printList = function () {
			var dateFrom = new Date(obj.get('filter-list-from').getValue());
			dateFrom.setHours(0,0,0,0);
			var dateTo = new Date(obj.get('filter-list-to').getValue());
			dateTo.setHours(23,59,59,999);
			var salitre = obj.get('filter-list-salitre').get('checkbox').get().checked;
			var compania = obj.get('filter-list-compania').get('checkbox').get().checked;
			obj.get().fire('tap-print-list', function (item) {
				if (dateFrom.getTime() > item.created) return false;
				if (dateTo.getTime() < item.created) return false;
				if (!salitre && item.user === 'salitre') return false;
				if (!compania && item.user === 'compania') return false;
				return true;
			})
		};

		obj.printBills = function () {
			var dateFrom = new Date(obj.get('filter-bill-from').getValue());
			dateFrom.setHours(0,0,0,0);
			var dateTo = new Date(obj.get('filter-bill-to').getValue());
			dateTo.setHours(23,59,59,999);
			var salitre = obj.get('filter-bill-salitre').get('checkbox').get().checked;
			var compania = obj.get('filter-bill-compania').get('checkbox').get().checked;
			obj.get().fire('tap-print-bills', {
				filter: function (item) {
					if (dateFrom.getTime() > item.created) return false;
					if (dateTo.getTime() < item.created) return false;
					if (item.type !== 'tarjeta credito') return false;
					if (item.value < 0) return false;
					if (!salitre && item.user === 'salitre') return false;
					if (!compania && item.user === 'compania') return false;
					return true;
				},
				start: obj.get('billNumber').getValue()
			})
		};

		obj.printCards = function () {
			var salitre = obj.get('filter-cards-salitre').get('checkbox').get().checked;
			var compania = obj.get('filter-cards-compania').get('checkbox').get().checked;
			obj.get().fire('tap-print-cards', function (item) {
				if (!salitre && item.user === 'salitre') return false;
				if (!compania && item.user === 'compania') return false;
				return true;
			})
		};

		obj.printClients = function () {
			var salitre = obj.get('filter-clients-salitre').get('checkbox').get().checked;
			var compania = obj.get('filter-clients-compania').get('checkbox').get().checked;
			obj.get().fire('tap-print-clients', function (item) {
				if (!salitre && item.user === 'salitre') return false;
				if (!compania && item.user === 'compania') return false;
				return true;
			})
		};

        return obj;

    }

};
