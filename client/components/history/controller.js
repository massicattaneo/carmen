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
			obj.get('transaction-list').empty()
			obj.get('name').setValue(clientData.name);
			obj.get('surname').setValue(clientData.surname);
			obj.get('email').setValue(clientData.email);
			obj.get('tel').setValue(clientData.tel);
			Object.keys(data)
				.filter(function (k) {
					return data[k].clientId && data[k].clientId.toString() === id.toString();
				})
				.forEach(function (key, i) {
					obj.get('transaction-list').add(key, data[key], i)
				});
		};

		obj.populateByCardId = function (cardId, cardsData, clientsData, data) {
			obj.get('transaction-list').empty()
			var id = cardsData[cardId].clientId;
			var clientData = clientsData[id];
			obj.get('name').setValue(clientData.name);
			obj.get('surname').setValue(clientData.surname);
			obj.get('email').setValue(clientData.email);
			obj.get('tel').setValue(clientData.tel);
			Object.keys(data)
				.filter(function (k) {
					return data[k].cardId && data[k].cardId.toString() === cardId.toString();
				})
				.forEach(function (key, i) {
					obj.get('transaction-list').add(key, data[key], i)
				});
		};

		obj.show = function () {
			obj.get().addStyle({ display: 'block' });
			obj.get('client-data').addStyle({ display: 'block' });
			obj.get('title').addStyle({ display: 'block' });
			obj.get('transaction-list').get('list').get('collection').addStyle({ 'max-height': '' })
		};

		obj.hideTitles = function () {
			obj.get('client-data').addStyle({ display: 'none' });
			obj.get('title').addStyle({ display: 'none' });
			obj.get('transaction-list').get('list').get('collection').addStyle({ 'max-height': '200px' })
		};

		return obj;

	}

}
