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

    var template = imports('components/settings/template.html');
    var style = imports('components/settings/style.scss');

    return function (config) {

        var c = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		c.show = function () {
			c.get().addStyle({display: 'block'});
		};

		c.changeBg = function (e) {
			var index = e.target.getAttribute('data-index');
			localStorage.setItem('bg-image', index);
			document.body.style.backgroundImage = 'url(images/bg/' + index + '.jpg)';
		};

		c.init = function () {
			var index = localStorage.getItem('bg-image') || 1;
			document.body.style.backgroundImage = 'url(images/bg/' + index + '.jpg)';
			document.body.className = '';
		};

        return c;

    }

};
