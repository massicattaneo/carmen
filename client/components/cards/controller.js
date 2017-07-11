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

    var template = imports('components/cards/template.html');
    var style = imports('components/cards/style.scss');

    return function (config) {

        var c = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		c.show = function () {
			c.get().addStyle({display: 'block'});
		};

		c.remove = function (id) {
			c.get('list').removeItem(id);
		};

        // c.populate = function (data) {
        //     c.get('list').emptyCollection();
        //     var keys = Object.keys(data).map(function (key) {return key;});
        //     c.get('list').populate('card', keys);
        // };

		c.add = function (id, info, count) {
			c.get('list').addItemByInfo('card', id, info, count)
		};

		c.enterMode = function (mode) {
			c.get().removeStyle('select');
			switch (mode) {
				case 'select':
					c.get('title').setValue('Seleciona una tarjeta');
					c.get().addStyle(mode);
					break;
				default:
					c.get('title').setValue(config.cardsText);
					break;
			}
		};

        return c;

    }

};
