function controller() {

	return function (config) {
		var obj = {};
		var events = {};
		var pointer = new cjs.Date(Date.now()).format('yyyy-mm-dd');
		var hours = [];

		function decimalToTime(decimalTimeString) {
			var n = new Date(0,0);
			n.setSeconds(+decimalTimeString * 60 * 60);
			return n.toTimeString().slice(0, 8).split(':').concat([0]).map(e => parseInt(e,10));

		}

		obj.addEvent = function ({ processId, room, date, description, summary, edit }) {
			var start = date;
			var end = new Date(date.getTime() + (config.calendarStep * 60 * 1000));
            config.calendar
				.insert(config.userId, {summary,start,end,description,processId})
				.done(function (id) {
					obj.drawEvent({ room, processId, date, summary, description, edit, id, start })
				});
		};

		obj.drawEvent = function ({ room, processId, summary, description, edit, id, start }) {
			var begin = new Date(start);
			begin.setHours(10,0,0,0);
			var top = 32 + (((start.getTime() - begin.getTime()) /60000)/config.calendarStep)*13;
			var event = cjs.Component.create('event', {
				config: {
					userId: config.userId,
					processId,
					id,
					edit,
					height: room * 13 + 'px',
					positionY: top + 'px',
					summary,
					description,
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
			hours.forEach(function (h) {h.remove();});
			hours = [];
			config.week[date.getDay()].periods.forEach(function (period) {
				var start = new Date(date);
				start.setHours(...decimalToTime(period[0]));
				var end = new Date(date);
				end.setHours(...decimalToTime(period[1]));
				while (start.getTime() <= end.getTime()) {
					var hour = cjs.Component.create('hour', {config: {label: (new cjs.Date(start)).format('TT:tt'), date: start}});
					hour.get().addListener('hour-add-event', function (e) {
						var { summary, processId, room, date, description, edit } = e.data;
						obj.addEvent({ processId, room, date, description, summary, edit });
					});
					hour.get().addListener('hour-modify-event', function (e) {
						var { userId, summary, id, processId, room, date, description, edit } = e.data;
						obj.get().fire('remove-event', {userId, id});
						obj.addEvent({ processId, room, date, description, summary, edit });
						config.calendar.delete(userId, id);
					});
					hour.createIn(obj.get());
					hours.push(hour);
					start = new Date(start.getTime()+ (config.calendarStep * 60 * 1000));
				}
			});
		};

		return obj;
	}

}
