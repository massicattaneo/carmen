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

		obj.initialise = function () {
			obj.get('salitre').get('checkbox').get().checked = localStorage.getItem('user') === 'salitre';
			obj.get('compania').get('checkbox').get().checked = localStorage.getItem('user') === 'compania';
			obj.get('filter-to').get().valueAsDate = new Date();
			obj.get('filter-from').get().valueAsDate = new Date();
			obj.get('transaction-list').initialise();
			obj.get('transaction-list').get('more-totals').addStyle({display: 'block'});
			obj.filter();

		};

		obj.update = function (info, id) {
			obj.get('transaction-list').updateItem(info, id)
		};

		obj.empty = function () {
			obj.get('transaction-list').empty();
		};

		obj.show = function () {
			obj.get('transaction-list').get('list').resetFilter();
			obj.get().addStyle({display: 'block'});
		};

		obj.remove = function (id) {
			obj.get('transaction-list').removeItem(id);
		};

		obj.add = function (id, info, count) {
			obj.get('transaction-list').add(id, info, count)
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

		obj.filter = function () {
			var salitre = obj.get('salitre').get('checkbox').get().checked;
			var compania = obj.get('compania').get('checkbox').get().checked;
			var filter = '';
			if (salitre && compania) filter = 'user=salitre||compania';
			else if (salitre) filter = 'user=salitre';
			else if (compania) filter = 'user=compania';
			else filter = 'user=none';
			var from = (new cjs.Date(obj.get('filter-from').get().valueAsDate)).format('dd-mm-yyyy');
			var to = (new cjs.Date(obj.get('filter-to').get().valueAsDate)).format('dd-mm-yyyy');
			filter += ' && created>='+from+' && created <='+to;
			obj.get('transaction-list').get('list').setFixedFilter(filter);
		};

        return obj;

    }
}
