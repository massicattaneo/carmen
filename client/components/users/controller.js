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

    var template = imports('components/users/template.html');
    var style = imports('components/users/style.scss');

    return function (config) {

        var c = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		c.show = function () {
			c.get().addStyle({display: 'block'});
		};

        return c;

    }

};
