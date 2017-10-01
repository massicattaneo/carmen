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
		var isEditing = false;
		var obj = cjs.Component({
			template: template,
			style: style,
			config: config
		});

		function getLabelValue() {
			var des = obj.get('description').getValue();
            return obj.get('summary').getValue() + (des === '' ? '' : ':' + des);
		}

		obj.init = function () {
			obj.get('description').setValue(config.description || '');
			obj.get('summary').setValue(config.summary);
			obj.get('label').setValue(getLabelValue());
			if (config.edit) {
				obj.edit();
				obj.get('input').get().focus();
				obj.get('input').get().select();
			}
		};

		obj.edit = function () {
			isEditing = true;
			obj.get().addStyle('editable');
			obj.get('input').setValue(obj.get('description').getValue());
			window.addEventListener('keydown', obj.stopEdit);
			obj.get('full-screen').addStyle({ display: 'block' });
		};

		obj.stopEdit = function (e) {
			if (e.key === 'Enter' || e.target === obj.get('full-screen').get()) {
				obj.get().removeStyle('editable');
				var description = obj.get('input').getValue().trim();
				obj.get('description').setValue(description);
				var summary = obj.get('summary').getValue().trim();
				isEditing = false;
				window.removeEventListener('keydown', obj.stopEdit);
				obj.get('full-screen').addStyle({ display: 'none' });
				obj.get('label').setAttribute('title', getLabelValue());
				config.calendar.update(config.userId, config.id, { description: description });
				obj.get('label').setValue(getLabelValue());
			}
		};

		obj.dragstart = function (ev) {
			setTimeout(function () {
				obj.get().addStyle({ visibility: 'hidden' });
			}, 1);
			var room = Math.ceil(Number(window.getComputedStyle(obj.get().get()).height.replace('px', '')) / 13);

			var data = {
				processId: config.processId, room,
				description: obj.get('description').getValue(),
				summary: obj.get('summary').getValue(),
				action: 'modify', id: config.id, userId: config.userId
			};
			ev.dataTransfer.setData("config", JSON.stringify(data));
		};

		obj.dragend = function () {
			obj.get().addStyle({ visibility: 'visible' });
		};

		obj.contextmenu = function (e) {
			e.preventDefault();
			var cm = cjs.Component.create('contextmenu', {});
			var comp = cjs.Component({
				template: `<div>
							<div data-on="click:changeLength" data-room="1" class="item">15 minutos</div>
							<div data-on="click:changeLength" data-room="2" class="item">30 minutos</div>
							<div data-on="click:changeLength" data-room="3" class="item">45 minutos</div>
							<div data-on="click:changeLength" data-room="4" class="item">1 hora</div>
							<div data-on="click:changeLength" data-room="5" class="item">1 hora y 15 minutos</div>
							<div data-on="click:changeLength" data-room="6" class="item">1 hora y 30 minutos</div>
							<div data-on="click:changeLength" data-room="8" class="item">2 horas</div>
							<div data-on="click:changeLength" data-room="12" class="item">3 horas</div>
							<div data-on="click:changeLength" data-room="16" class="item">4 hora</div>
							<div data-on="click:changeLength" data-room="40" class="item">1 dia</div>
							<hr/>
							<div data-on="click:delete" class="item">Borrar</div>
							</div>`
			}, {
				delete: function () {
					cm.remove();
					config.calendar.delete(config.userId, config.id).done(function (e) {
						obj.remove();
					});
				},
				changeLength: function (e) {
					cm.remove();
					var room = Number(e.target.getAttribute('data-room'));
					var end = new Date(config.start.getTime() + (room*config.calendarStep)*60000);
					config.calendar.update(config.userId, config.id, { end, start: config.start }).done(function (e) {
						obj.get().addStyle({ height: room * 13 + 'px' })
					});
				}
			});
			comp.createIn(cm.get());
			cm.get().addStyle({ top: e.pageY + 'px', left: e.pageX + 'px' });
			cm.createIn(document.body);
		};

		return obj;

	}

};
