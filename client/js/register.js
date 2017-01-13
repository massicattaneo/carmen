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

    var userController = imports('components/user/controller.js');
    var userTemplate = imports('components/user/template.html');
    var userStyle = imports('components/user/style.scss');

    var listController = imports('components/list/controller.js');
    var listTemplate = imports('components/list/template.html');
    var listStyle = imports('components/list/style.scss');

    var clientController = imports('components/client/controller.js');
    var clientTemplate = imports('components/client/template.html');
    var clientStyle = imports('components/client/style.scss');

    var clientEditController = imports('components/client-edit/controller.js');
    var clientEditTemplate = imports('components/client-edit/template.html');
    var clientEditStyle = imports('components/client-edit/style.scss');

    return function (config) {

        cjs.Component.registerParserFunction('mailto', function (data, item) {
            item.setAttribute('href', 'mailto:' + data);
        });

        cjs.Component.registerParserFunction('tel', function (data, item) {
            item.setAttribute('href', 'tel:' + data);
        });

        /** ROUND-BUTTON **/
        cjs.Component.register({
            name: 'button',
            controller: buttonController,
            template: buttonTemplate,
            style: buttonStyle,
            config: config
        });

        /** CALENDAR DAY **/
        cjs.Component.register({
            name: 'day',
            controller: dayController,
            template: dayTemplate,
            style: dayStyle,
            config: config
        });

        /** USER **/
        cjs.Component.register({
            name: 'user',
            controller: userController,
            template: userTemplate,
            style: userStyle,
            config: config
        });

        /** LIST **/
        cjs.Component.register({
            name: 'list',
            controller: listController,
            template: listTemplate,
            style: listStyle,
            config: config
        });

        /** CLIENT **/
        cjs.Component.register({
            name: 'client',
            controller: clientController,
            template: clientTemplate,
            style: clientStyle,
            config: config
        });

        /** CLIENT EDIT **/
        cjs.Component.register({
            name: 'clientEdit',
            controller: clientEditController,
            template: clientEditTemplate,
            style: clientEditStyle,
            config: config
        });

    }

}