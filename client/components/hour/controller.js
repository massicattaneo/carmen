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
			var { processId , summary, room, action, userId, id } = JSON.parse(e.dataTransfer.getData("config"));
			if (action === 'add') {
				obj.get().fire('hour-add-event', { processId, room, date, summary, edit: true });
			} else if (action === 'modify') {
				obj.get().fire('hour-modify-event', { userId, id, processId, room, date, summary, edit: false });
			}
		};

		obj.contextmenu = function (e) {
			e.preventDefault();
			var cm = cjs.Component.create('contextmenu', {});
			var comp = cjs.Component({
				template: `<div><div data-on="click:paste" class="item">Pegar</div></div>`
			}, {
				paste: function () {
					cm.remove();
					var { date } = config;
					obj.get().fire('paste-clipboard', {date});
				}
			});
			comp.createIn(cm.get());
			var top = e.pageY;
			console.log(top);
			if (top > 500) top-= 20;
			cm.get().addStyle({ top: top + 'px', left: e.pageX + 'px' });
			cm.createIn(document.body);
		};

		return obj;

	}

};
