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

    var template = imports('components/archive/template.html');
    var style = imports('components/archive/style.scss');

    return function (config) {

        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
			sinContactos();
			notRelatedToCards();
			buyTransactions();
			emptyCards();
		};

		function buyTransactions() {
			var total = 0;
			var count = 0;
			var transactionsData = config.transactionsData;
			Object.keys(transactionsData).forEach(function (key) {
				if (!isPositive(key) && !isRelatedToClient(key)) {
					total+= transactionsData[key].value;
					count++;
				}
			});
			obj.get('buy-transactions-count').setValue('N. ' + count);
			cjs.Component.parse('currency', total, obj.get('buy-transactions-total'));
		}

		function doNotExistCard(cardId) {
			return !Object.keys(config.cardsData).filter(key => key === cardId).length;
		}

		function notRelatedToCards() {
			var total = 0;
			var count = 0;
			var transactionsData = config.transactionsData;
			Object.keys(transactionsData).forEach(function (key) {
				if (isOldTransaction(key) && !isSinContacto(key) && isPositive(key) && isRelatedToClient(key)) {
					if (isNotRelatedToCard(key)) {
						total+= transactionsData[key].value;
						count++;
					} else if (doNotExistCard(transactionsData[key].cardId)) {
						console.log(transactionsData[key])
					}

				}
			});
			obj.get('no-card-related-count').setValue('N. ' + count);
			cjs.Component.parse('currency', total, obj.get('no-card-related-total'));
		}
		function sinContactos() {
			var total = 0;
			var count = 0;
			var transactionsData = config.transactionsData;
			Object.keys(transactionsData).forEach(function (key) {
				if (isOldTransaction(key) && isSinContacto(key) && isPositive(key) && isRelatedToClient(key) ) {
					total+= transactionsData[key].value;
					count++;
				}
			});
			obj.get('sin-contacto-count').setValue('N. ' + count);
			cjs.Component.parse('currency', total, obj.get('sin-contacto-total'));
		}
		function emptyCards() {
			var total = 0;
			var count = 0;
			var transactionsData = config.transactionsData;
			var cardData = config.cardsData;
			Object.keys(cardData).forEach(function (cardId) {
				let filter = Object.keys(transactionsData)
					.filter(key => transactionsData[key].cardId === cardId);
				if (filter.length === 0 || (filter.length > 1 && filter.reduce((a,b) => {a+= transactionsData[b].value; return a;},0) === 0)) {
					console.log(cardData[cardId].name);
					count++;
				}
			});
			obj.get('empty-cards-count').setValue('N. ' + count);
			cjs.Component.parse('currency', total, obj.get('empty-cards-total'));
		}

		function isOldTransaction(key) {
			return config.transactionsData[key].created < (Date.now() - (95 * 24 * 60 * 60 * 1000));
		}
		function isNotRelatedToCard(key) {
			return config.transactionsData[key].cardId === ''
		}
		function isRelatedToClient(key) {
			return config.transactionsData[key].clientId !== undefined;
		}
		function isSinContacto(key) {
			return config.transactionsData[key].clientId === '-Ko7NjALDw2rdlK-BvV9';
		}

		function isPositive(key) {
			return config.transactionsData[key].value >= 0;
		}

        return obj;

    }

};
