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
    // var Calendar = imports('components/calendar/controller.js');
    var Settings = imports('components/settings/controller.js');
    var Users = imports('components/users/controller.js');
    var Clients = imports('components/clients/controller.js');
    var PopUp = imports('components/pop-up/controller.js');
    var config = imports('js/config.json');
    var register = imports('js/register.js');
    var audioConfig = imports('sounds/config.json');

    return function () {
        var pages = {};
        var audio = cjs.Audio();
        audio.init(audioConfig);

        cjs.bus.addBus('UI');
        cjs.bus.UI.on('button-click', function (o) {
            audio.play(o.type);
            switch (o.type) {
                case 'header':showPage(o.id);break;
                case 'client-delete':deleteClient(o.id);break;
            }
        });

        register(config);
        var header = Header(config);
        header.createIn(document.getElementById('header'));

        // var calendar = Calendar(config);
        // calendar.createIn(document.getElementById('page'));

        pages.settings = Settings(config);
        pages.settings.createIn(document.getElementById('page'));

        pages.users = Users(config);
        pages.users.createIn(document.getElementById('page'));

        pages.clients = Clients(config);
        pages.clients.createIn(document.getElementById('page'));

        firebase.database().ref('clients').on('child_removed', function () {
            data.key
        })

        var blackScreen = BlackScreen(config);
        blackScreen.createIn(document.body);
        document.body.className = '';
        cjs.Need([
            pages.clients.populate,
            function () {
                blackScreen.removeCover(1);
                // blackScreen.removeCover(2000);
                showPage('clients');
            }
        ]).start();

        function showPage(pageName) {
            Object.keys(pages).forEach(function (k) {
                pages[k].get().addStyle({display: 'none'});
            });
            pages[pageName].get().addStyle({display: 'block'});
        }
        function deleteClient(id) {
            showPopUp('delete-client').done(function (what) {
                debugger;
                if (what === 'delete-client') {
                    firebase.database().ref('clients/' + id).remove();
                }
            })
        }
        function showPopUp(type) {
            var popUp = PopUp(cjs.Object.extend({type: type}, config));
            popUp.createIn(document.body);
            var n = cjs.Need();
            cjs.Need([
                blackScreen.show,
                popUp.show,
                function (q, whatToDo) {
                    n.resolve(whatToDo);
                    return cjs.Need().resolve();
                },
                popUp.hide,
                function () {
                    blackScreen.hide();
                    document.body.removeChild(popUp.get().get())
                }
            ]).start()
            return n;
        }
    };
}