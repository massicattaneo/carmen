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

    var template = imports('components/history/template.html');
    var style = imports('components/history/style.scss');

    return function (config) {

        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

        obj.populate = function (id, clientData, data) {
            obj.get('name').setValue(clientData.name);
            obj.get('surname').setValue(clientData.surname);
            obj.get('email').setValue(clientData.email);
            obj.get('tel').setValue(clientData.tel);
            return obj.get('transaction-list').populate(data, function (k, data) {
                return data[k].clientId && data[k].clientId.toString() === id.toString();
            });
        };

        obj.populateByCardId = function (cardId, cardsData, clientsData, transactionData) {
			var id = cardsData[cardId].clientId;
			var clientData = clientsData[id];
			obj.get('name').setValue(clientData.name);
			obj.get('surname').setValue(clientData.surname);
			obj.get('email').setValue(clientData.email);
			obj.get('tel').setValue(clientData.tel);
			return obj.get('transaction-list').populate(transactionData, function (k, data) {
				return data[k].cardId && data[k].cardId.toString() === cardId.toString();
			});
		};

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
		};

        return obj;

    }

}
