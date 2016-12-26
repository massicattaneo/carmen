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
    var BlackScreen = imports('components/black-screen/controller.js');
    var Calendar = imports('components/calendar/controller.js');
    var Users = imports('components/users/controller.js');
    var config = imports('js/config.json');
    var register = imports('js/register.js');

    return function () {
        cjs.bus.addBus('UI');
        cjs.bus.UI.on('button-click', function (type) {
            console.log(type)
        });

        register(config);
        var header = Header(config);
        header.createIn(document.getElementById('header'));

        var calendar = Calendar(config);
        calendar.createIn(document.getElementById('page'));

        var users = Users(config);
        //users.createIn(document.getElementById('page'));

        var blackScreen = BlackScreen(config);
        blackScreen.createIn(document.body);
        document.body.className = '';
        blackScreen.removeCover(1000);
    };
}