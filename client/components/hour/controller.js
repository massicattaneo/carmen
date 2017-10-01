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

	var template = imports('components/calendar/template.html');
	var style = imports('components/calendar/style.scss');

	return function (config) {

		var obj = cjs.Component({
			template: template,
			style: style,
			config: config
		});

		obj.dragenter = function () {
			obj.get().addStyle('hover');
		};
		obj.dragleave = function () {
			obj.get().removeStyle('hover');
		};
		obj.dragover = function (e) {
			e.preventDefault()
		};
		obj.drop = function (e) {
			obj.get().removeStyle('hover');
			var date = config.date;
			var { processId , summary, room, action, userId, description, id } = JSON.parse(e.dataTransfer.getData("config"));
			if (action === 'add') {
				obj.get().fire('hour-add-event', { processId, room, date, summary, description, edit: true });
			} else if (action === 'modify') {
				obj.get().fire('hour-modify-event', { userId, id, processId, room, date, description, summary, edit: false });
			}
		};

		return obj;

	}

};
