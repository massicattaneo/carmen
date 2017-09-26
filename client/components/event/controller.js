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
	var hours = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15',
		'12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00',
		'15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
		'18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00',
		'20:15', '20:30', '20:45', '21:00'];

	return function (config) {
		var isEditing = false;
		var obj = cjs.Component({
			template: template,
			style: style,
			config: config
		});

		obj.init = function () {
			if (config.edit) {
				obj.edit();
				obj.get('input').get().focus();
				obj.get('input').get().select();
			}
		};

		obj.edit = function () {
			isEditing = true;
			obj.get().addStyle('editable');
			obj.get('input').setValue(obj.get('label').getValue());
			window.addEventListener('keydown', obj.stopEdit);
			obj.get('full-screen').addStyle({ display: 'block' });
		};

		obj.stopEdit = function (e) {
			if (e.key === 'Enter' || e.target === obj.get('full-screen').get()) {
				obj.get().removeStyle('editable');
				var value = obj.get('input').getValue().trim();
				isEditing = false;
				window.removeEventListener('keydown', obj.stopEdit);
				obj.get('full-screen').addStyle({ display: 'none' });
				obj.get('label').setAttribute('title', value);
				config.calendar.update(config.dayName, config.id, { summary: value });
				obj.get('label').setValue(value);
			}
		};

		obj.dragstart = function (ev) {
			setTimeout(function () {
				obj.get().addStyle({ visibility: 'hidden' });
			}, 1);
			var room = Math.ceil(Number(window.getComputedStyle(obj.get().get()).height.replace('px', '')) / 13);

			var data = {
				processId: config.processId, room,
				label: obj.get('label').getValue(),
				action: 'modify', id: config.id, dayName: config.dayName
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
					config.calendar.delete(config.dayName, config.id).done(function (e) {
						obj.remove();
					});
				},
				changeLength: function (e) {
					cm.remove();
					var room = Number(e.target.getAttribute('data-room'));
					var hourId = config.hourId;
					var date = new cjs.Date(config.start).format('yyyy-mm-dd');
					var end = new Date(`${date} ${hours[hourId + room]}`);
					config.calendar.update(config.dayName, config.id, { end, start: config.start }).done(function (e) {
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
