/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: bootstrap.js
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function boostrap(imports) {
    var Header = imports('js/header/controller.js');
    var config = imports('js/config.json');
    var roundButtonController = imports('js/round-button/controller.js');
    var roundButtonTemplate = imports('js/round-button/template.html');
    var roundButtonStyle = imports('js/round-button/style.scss');

    var roundColoredButtonController = imports('js/round-colored-button/controller.js');
    var roundColoredButtonTemplate = imports('js/round-colored-button/template.html');
    var roundColoredButtonStyle = imports('js/round-colored-button/style.scss');

    return function () {

        /** ROUND-BUTTON **/
        Component.register({
            name: 'roundButton',
            controller: roundButtonController(),
            template: roundButtonTemplate,
            style: roundButtonStyle,
            config: config
        });

        Component.register({
            name: 'roundColoredButton',
            controller: roundColoredButtonController(),
            template: roundColoredButtonTemplate,
            style: roundColoredButtonStyle,
            config: config
        });

        var header = Header(config);
        // var list = L(config);
        // var server = Sv();
        //
        header.createIn(document.getElementById('website'));
        // list.createIn(p.list);
        // server.createIn(p.server);
        //
        // list.addItem(['Test item']);
        //
        // standard.submit = function () {
        //     if (standard.isValid()) {
        //         list.addItem(standard.getValue());
        //         standard.setValue('');
        //     }
        // };
        
    };
}