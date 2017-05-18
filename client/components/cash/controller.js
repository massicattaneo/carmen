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
                return cjs.Date.isToday(data[k].created);
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
				array.push({
					type: o.get('type').getValue(),
					name: o.get('name').getValue(),
					value: parseFloat(o.get('value').getValue().replace('€','').replace(',', '|').replace('.', ',').replace('|', '.')),
					description: o.get('description').getValue()
				})
			});
            return cjs.Need().resolve(array);
		};

        return obj;

    }
}
