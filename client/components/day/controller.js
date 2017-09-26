function controller() {

	return function (config) {
		var obj = {};
		var events = {};
		var pointer = new cjs.Date(Date.now()).format('yyyy-mm-dd');
		var hours = ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15',
			'12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00',
			'15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45',
			'18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00',
			'20:15', '20:30', '20:45', '21:00'];

		obj.init = function () {
			hours.slice(0, 41).forEach(function (hour, id) {
				var comp = cjs.Component({
					template: `<div class="hour" data-on="drop:drop||dragover:dragover||dragenter:dragenter||dragleave:dragleave"><label>{{hour}}</label></div>`,
					style: '.&.hover label {background-color: #33ce41}',
					config: { hour, id }
				}, {
					dragenter: function () {
						this.get().addStyle('hover');
					},
					dragleave: function () {
						this.get().removeStyle('hover');
					},
					dragover: function (e) {
						e.preventDefault()
					},
					drop: function (e) {
						this.get().removeStyle('hover');
						var hour = this.config.hour;
						var hourId = this.config.id;
						var { processId, room, label, action, id, dayName } = JSON.parse(e.dataTransfer.getData("config"));
						if (action === 'add') {
							obj.addEvent({ processId, hour, room, hourId, label, edit: true });
						} else if (action === 'modify') {
							obj.get().fire('remove-event', {dayName, id});
							obj.addEvent({ processId, hour, room, hourId, label, edit: false });
							config.calendar.delete(dayName, id);
						}
					}
				});
				comp.createIn(obj.get());
			});
		};

		obj.addEvent = function ({ room, processId, hourId, label, edit }) {
			var start = new Date(`${pointer} ${hours[hourId]}`);
			config.calendar.insert(config.dayName, {
				summary: label,
				start: start,
				end: new Date(`${pointer} ${hours[hourId + room]}`),
				description: processId
			}).done(function (id) {
				obj.drawEvent({ room, processId, hourId, label, edit, id, start })
			});
		};

		obj.drawEvent = function ({ room, processId, hourId, label, edit, id, start }) {
			var top = 32 + (hourId * 13);
			var event = cjs.Component.create('event', {
				config: {
					dayName: config.dayName,
					processId,
					id,
					edit,
					height: room * 13 + 'px',
					hourId,
					positionY: top + 'px',
					label,
					start
				}
			});
			events[id] = event;
			event.createIn(obj.get());
		};

		obj.clearEvents = function () {
			Object.keys(events).forEach(function (k) {
				if (events[k].node.get().parentNode)
					events[k].remove();
			});
			events = {};
		};

		obj.removeDrawEvent = function (id) {
			events[id].remove();
			delete events[id];
		};

		obj.setDate = function (date) {
			pointer = new cjs.Date(date.getTime()).format('yyyy-mm-dd');
		};

		return obj;
	}

}
