/**
 * Created by max on 31/01/17.
 */

function cash(imports) {
    var template = imports('components/cash/template.html');
    var style = imports('components/cash/style.scss');

    return function (config) {

        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

        obj.update = function (transactions) {
            obj.get('transaction-list').populate(transactions, function (k, data) {
                return true;
            });
        };

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
		};

		obj.remove = function (id) {
			obj.get('transaction-list').removeItem(id);
		};

		obj.getList = function () {
			var list = obj.get('transaction-list').get('list');
			var array = [];
			list.each(function (k,i,o) {
				if (o.get().hasStyle('visible')) {
					array.push({
						type: o.get('type').getValue(),
						name: o.get('name').getValue(),
						cardId: o.get('cardId').getValue(),
						value: parseFloat(o.get('value').getValue().replace('€','').replace(',', '|').replace('.', ',').replace('|', '.')),
						description: o.get('description').getValue()
					})
				}
			});
            return cjs.Need().resolve(array);
		};

		obj.filterToday = function () {
			var list = obj.get('transaction-list').get('list');
			var a = new cjs.Date();
			list.get('filter').setValue('filter: created='+ a.format('dd-mm-yyyy'));
			list.filter()
		};

		obj.filterTodayBills = function () {
			var list = obj.get('transaction-list').get('list');
			var a = new cjs.Date();
			list.get('filter').setValue('filter: created='+ a.format('dd-mm-yyyy') + ' & type=tarjeta credito  & value>0');
			list.filter()
		};

		obj.filterEmpty = function () {
			var list = obj.get('transaction-list').get('list');
			list.get('filter').setValue('');
			list.filter()
		};

        return obj;

    }
}
