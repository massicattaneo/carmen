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
    var Header = imports('components/header/controller.js');
    var config = imports('js/config.json');
    var roundButtonController = imports('components/round-button/controller.js');
    var roundButtonTemplate = imports('components/round-button/template.html');
    var roundButtonStyle = imports('components/round-button/style.scss');

    return function () {

        /** ROUND-BUTTON **/
        Component.register({
            name: 'roundButton',
            controller: roundButtonController(),
            template: roundButtonTemplate,
            style: roundButtonStyle,
            config: config
        });

        var header = Header(config);        
        header.createIn(document.getElementById('website'));
        
        
    };
}