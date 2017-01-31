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

        obj.update = function () {
            return obj.get('transaction-list').populate(function (k, data) {
                return cjs.Date.isToday(data[k].creation);
            });
        };

        return obj;

    }
}