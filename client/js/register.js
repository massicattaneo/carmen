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

    var processController = imports('components/process/controller.js');
    var processTemplate = imports('components/process/template.html');
    var processStyle = imports('components/process/style.scss');

    var listController = imports('components/list/controller.js');
    var listTemplate = imports('components/list/template.html');
    var listStyle = imports('components/list/style.scss');

    var clientController = imports('components/client/controller.js');
    var clientTemplate = imports('components/client/template.html');
    var clientStyle = imports('components/client/style.scss');

    var clientEditController = imports('components/client-edit/controller.js');
    var clientEditTemplate = imports('components/client-edit/template.html');
    var clientEditStyle = imports('components/client-edit/style.scss');

    var transactionController = imports('components/transaction/controller.js');
    var transactionTemplate = imports('components/transaction/template.html');
    var transactionStyle = imports('components/transaction/style.scss');

    var transactionAddController = imports('components/transaction-add/controller.js');
    var transactionAddTemplate = imports('components/transaction-add/template.html');
    var transactionAddStyle = imports('components/transaction-add/style.scss');

	var transactionCardController = imports('components/transaction-card/controller.js');
	var transactionCardTemplate = imports('components/transaction-card/template.html');
	var transactionCardStyle = imports('components/transaction-card/style.scss');

    var transactionListController = imports('components/transaction-list/controller.js');
    var transactionListTemplate = imports('components/transaction-list/template.html');
    var transactionListStyle = imports('components/transaction-list/style.scss');

	var cardController = imports('components/card/controller.js');
	var cardTemplate = imports('components/card/template.html');
	var cardStyle = imports('components/card/style.scss');

	var bonusController = imports('components/bonus/controller.js');
	var bonusTemplate = imports('components/bonus/template.html');
	var bonusStyle = imports('components/bonus/style.scss');

	var switchController = imports('components/switch/controller.js');
	var switchTemplate = imports('components/switch/template.html');
	var switchStyle = imports('components/switch/style.scss');

	var eventController = imports('components/event/controller.js');
	var eventTemplate = imports('components/event/template.html');
	var eventStyle = imports('components/event/style.scss');

	var miniCalController = imports('components/mini-calendar/controller.js');
	var miniCalTemplate = imports('components/mini-calendar/template.html');
	var miniCalStyle = imports('components/mini-calendar/style.scss');

	var contextMenuController = imports('components/context-menu/controller.js');
	var contextMenuTemplate = imports('components/context-menu/template.html');
	var contextMenuStyle = imports('components/context-menu/style.scss');

	var hourController = imports('components/hour/controller.js');
	var hourTemplate = imports('components/hour/template.html');
	var hourStyle = imports('components/hour/style.scss');

    return function (config) {

        cjs.Component.registerParserFunction('currency', function (data, item) {
            var currency = new cjs.Currency(parseFloat(data).toFixed(2));
			if (item) {
				item.setValue(currency.format('s i,ff'));
				data < 0 && item.addStyle('negative');
			}
			return currency.format('s i,ff');
        });

		cjs.Component.registerParserFunction('transactionType', function (data, item) {
            if (data) {
				item.get().parentElement.className += ' bonus'
			}
        });

        cjs.Component.registerParserFunction('short-date', function (data, item) {
            var date = new cjs.Date(data);
			var formatted = date.format('dd-mm-yyyy');
			if (item) {
				item.setValue(formatted);
			} return formatted;
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

        /** MINI CALENDAR **/
        cjs.Component.register({
            name: 'minicalendar',
            controller: miniCalController,
            template: miniCalTemplate,
            style: miniCalStyle,
            config: config
        });

        /** USER **/
        cjs.Component.register({
            name: 'process',
            controller: processController,
            template: processTemplate,
            style: processStyle,
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

        /** TRANSACTION **/
        cjs.Component.register({
            name: 'transaction',
            controller: transactionController,
            template: transactionTemplate,
            style: transactionStyle,
            config: config
        });

        /** TRANSACTION ADD **/
        cjs.Component.register({
            name: 'transaction-add',
            controller: transactionAddController,
            template: transactionAddTemplate,
            style: transactionAddStyle,
            config: config
        });

		/** TRANSACTION CARD **/
		cjs.Component.register({
			name: 'transaction-card',
			controller: transactionCardController,
			template: transactionCardTemplate,
			style: transactionCardStyle,
			config: config
		});

        /** TRANSACTION LIST **/
        cjs.Component.register({
            name: 'transactionList',
            controller: transactionListController,
            template: transactionListTemplate,
            style: transactionListStyle,
            config: config
        });

		/** CARD **/
        cjs.Component.register({
            name: 'card',
            controller: cardController,
            template: cardTemplate,
            style: cardStyle,
            config: config
        });

		/** BONUS **/
        cjs.Component.register({
            name: 'bonus',
            controller: bonusController,
            template: bonusTemplate,
            style: bonusStyle,
            config: config
        });

		/** SWITCH **/
		cjs.Component.register({
			name: 'switch',
			controller: switchController,
			template: switchTemplate,
			style: switchStyle,
			config: config
		});

		/** EVENT **/
		cjs.Component.register({
			name: 'event',
			controller: eventController,
			template: eventTemplate,
			style: eventStyle,
			config: config
		});

		/** CONTEXT MENU **/
		cjs.Component.register({
			name: 'contextmenu',
			controller: contextMenuController,
			template: contextMenuTemplate,
			style: contextMenuStyle,
			config: config
		});

		/** HOUR **/
		cjs.Component.register({
			name: 'hour',
			controller: hourController,
			template: hourTemplate,
			style: hourStyle,
			config: config
		});

    }

}
