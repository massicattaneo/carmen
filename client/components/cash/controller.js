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

        return obj;

    }
}
