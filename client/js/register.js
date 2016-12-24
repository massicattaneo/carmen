/**
 * Created by piera on 24/12/16.
 */


function register(imports) {
    var buttonController = imports('components/button/controller.js');
    var buttonTemplate = imports('components/button/template.html');
    var buttonStyle = imports('components/button/style.scss');

    var dayController = imports('components/day/controller.js');
    var dayTemplate = imports('components/day/template.html');
    var dayStyle = imports('components/day/style.scss');

    return function (config) {

        /** ROUND-BUTTON **/
        cjs.Component.register({
            name: 'button',
            controller: buttonController(),
            template: buttonTemplate,
            style: buttonStyle,
            config: config
        });

        /** CALENDAR DAY **/
        cjs.Component.register({
            name: 'day',
            controller: dayController(),
            template: dayTemplate,
            style: dayStyle,
            config: config
        });
    }

}