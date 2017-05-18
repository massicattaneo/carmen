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

    return function (config, where) {

        var types = {
            'delete-client': {
                title: 'BORRAR?',
                text: '¿Estás seguro de que quieres borrar este cliente?',
                buttons: [{
                    text: 'SI',
                    type: 'delete',
                    class: 'popup'
                },{
                    text: 'NO',
                    type: 'close',
                    class: 'popup'
                }]
            },
			'delete-transaction': {
				title: 'BORRAR?',
				text: '¿Estás seguro de que quieres borrar esta transactione?',
				buttons: [{
					text: 'SI',
					type: 'delete',
					class: 'popup'
				},{
					text: 'NO',
					type: 'close',
					class: 'popup'
				}]
			},
			'delete-card': {
				title: 'BORRAR?',
				text: '¿Estás seguro de que quieres borrar esta tarjeta?',
				buttons: [{
					text: 'SI',
					type: 'delete',
					class: 'popup'
				},{
					text: 'NO',
					type: 'close',
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

        types[config.type].buttons.forEach(function (b, i) {
            buttons.push(cjs.Component.create('button', {config: b}));
            buttons[i].createIn(c.get('buttons').get());
            buttons[i].get().addListener('tap-'+b.type, function () {
                n.resolve(b.type)
            })
        });

        c.show = function () {
            c.get().addStyle('show');
            c.runAnimation('show', 500);
			n = cjs.Need();
            return n;
        };

        c.hide = function () {
            return c.runAnimation('hide', {time: 500}).done(function () {
				c.get().removeStyle('show');
			});
        };

		c.createIn(where);


		return c;

    }

};
