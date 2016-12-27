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

    var template = imports('components/pop-up/template.html');
    var style = imports('components/pop-up/style.scss');

    return function (config) {

        var types = {
            temp: {
                title: 'Titulo',
                text: 'eso esto una sentencia de prueba. <br/> Nueva linea.',
                buttons: [{
                    text: 'Close',
                    type: 'close',
                    useBus: false,
                    class: 'popup'
                }]
            }
        };

        var c = cjs.Component({
            template: template,
            style: style,
            config: cjs.Object.extend(types[config.type], config)
        });

        var buttons = [];
        var n = cjs.Need();
        var Button = cjs.Component.get('button');

        types[config.type].buttons.forEach(function (b, i) {
            var config = cjs.Object.extend(b, config);
            buttons.push(cjs.Component({
                template: Button.template,
                style: Button.style,
                config: config
            },
                Button.controller(config)
            ));
            buttons[i].createIn(c.get('buttons').get());
            buttons[i].promise().done(n.resolve)
        });

        c.show = function (type) {
            var t = types[type];
            c.get().addStyle('show');
            c.runAnimation('show', 500);
            return n;
        };

        c.hide = function () {
            return c.runAnimation('hide', 500);
        };

        return c;

    }

};
