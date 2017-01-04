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
    var Clients = imports('components/clients/controller.js');
    var PopUp = imports('components/pop-up/controller.js');
    var config = imports('js/config.json');
    var register = imports('js/register.js');

    return function () {
        cjs.bus.addBus('UI');
        cjs.bus.UI.on('button-click', function (o) {
            console.log(o.type, o.id)
        });

        register(config);
        var header = Header(config);
        header.createIn(document.getElementById('header'));

        var calendar = Calendar(config);
        //calendar.createIn(document.getElementById('page'));

        var users = Users(config);
        //users.createIn(document.getElementById('page'));
        
        var clients = Clients(config);
        clients.createIn(document.getElementById('page'));

        var blackScreen = BlackScreen(config);
        blackScreen.createIn(document.body);
        document.body.className = '';
        blackScreen.removeCover(2000);

        function showPopUp(type) {
            var popUp = PopUp(cjs.Object.extend({type: 'temp'}, config));
            popUp.createIn(document.body);
            cjs.Need([
                blackScreen.show,
                popUp.show,
                popUp.hide,
                function () {
                    blackScreen.hide();
                    document.body.removeChild(popUp.get().get())
                }
            ]).start()

        }
    };
}