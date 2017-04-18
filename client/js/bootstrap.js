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
    var Cash = imports('components/cash/controller.js');
    var History = imports('components/history/controller.js');
    var PopUp = imports('components/pop-up/controller.js');
    var config = imports('js/config.json');
    var register = imports('js/register.js');
    var audioConfig = imports('sounds/config.json');

    return function (db) {
        var pages = {};
        var clients;
        var transactions;
        var audio = cjs.Audio();
        audio.init(audioConfig);

        cjs.bus.addBus('UI');
        cjs.bus.UI.on('button-click', function (o) {
            audio.play(o.type);
            switch (o.type) {
                case 'header':showPage(o.id);break;
                case 'client-history':
                    pages.history.populate(clients[o.id], o.id);
                    showPage('history');
                    break;
                case 'client-delete':deleteClient(o.id);break;
                case 'client-edit':editClient(o.id);break;
                case 'client-update':updateClient(o.id, o.info); break;
                case 'transaction-new':addTransaction(); break;
            }
        });

        config.db = db;
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

        pages.history = History(config);
        pages.history.createIn(document.getElementById('page'));

        pages.cash = Cash(config);
        pages.cash.createIn(document.getElementById('page'));

        addEmptyPage()

        db.onRemove('clients', function (data) {
            pages.clients.remove(data.key)
        });

        var loadData = cjs.Need([]);
        loadData.add(db.onChange('clients', function (data) {
            clients = data;
            pages.clients.populate(data);
        }));
        loadData.add(db.onChange('transactions/', function (data) {
            transactions = data;
            pages.cash.update(transactions);
        }));

        var blackScreen = BlackScreen(config);
        blackScreen.createIn(document.body);
        document.body.className = '';
        cjs.Need([
            function () {return loadData},
            function (queue, c) {
                blackScreen.removeCover(1);
                // blackScreen.removeCover(2000);
                showPage('cash');
            }
        ]).start();

        function addEmptyPage() {
            pages.empty && pages.empty.remove();
            pages.empty = cjs.Component({
                template: '<div><h1 data-item="title"></h1><div data-item="container"></div></div>',
                style: '.& {color: white}'
            });
            pages.empty.createIn(document.getElementById('page'));
        }
        function showPage(pageName, data) {
            Object.keys(pages).forEach(function (k) {
                pages[k].get().addStyle({display: 'none'});
            });
            pages[pageName].get().addStyle({display: 'block'});
        }
        function deleteClient(id) {
            showPopUp('delete-client').done(function (what) {
                if (what === 'delete') {
                    db.remove('clients/' + id);
                }
            })
        }
        function updateClient(id, info) {
            db.update('clients/' + id, info);
        }
        function editClient(id) {
            pages.clients.edit(id, clients[id]);
        }
        function addTransaction() {
            cjs.Need([
                function () {
                    addEmptyPage();
                    showPage('empty');
                    pages.empty.get('title').setValue('SELECT A CLIENT');
                    var keys = Object.keys(clients).map(function (key) {return key;});
                    var list = cjs.Component.create('list', {});
                    list.populate('client-select', keys);
                    list.createIn(pages.empty.get('container'));
                    return cjs.bus.UI.need('button-click');
                },
                function (queue, o) {
                    addEmptyPage();
                    pages.empty.get('title').setValue('INSERT TRANSACTION INFORMATION');
                    var transaction = cjs.Component.create('transaction-add', {});
                    transaction.createIn(pages.empty.get('container'));
                    return cjs.bus.UI.need('button-click');
                },
                function (queue, o) {
                    addEmptyPage();
                    pages.empty.get('title').setValue('SAVED');
                }
            ]).start();


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
            ]).start();
            return n;
        }
    };
}