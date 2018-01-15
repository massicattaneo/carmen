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

		obj.copyClipboard = function (e) {
			config.clipboard.set(e.data);
		};

		obj.pasteClipboard = function (e) {
			if (config.clipboard.get()) {
				var { processId, room, summary } = config.clipboard.get();
				var date = e.data.date;
				obj.addEvent({ processId, room, date, summary, edit: false });
			}
		};

		obj.addEvent = function ({ processId, room, date, summary, edit }) {
			var start = date;
			var end = new Date(date.getTime() + (config.calendarStep * 60 * 1000) * room);
            config.calendar
				.insert(config.userId, {summary,start,end,processId})
				.done(function (id) {
					obj.drawEvent({ room, processId, summary, edit, id, start })
				});
		};

		obj.drawEvent = function ({ room, processId, summary, edit, id, start }) {
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
					start,
					room
				}
			});
			event.get().addListener('copy-clipboard', obj.copyClipboard);
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
			var exc = (config.exceptions || []).filter(function (item) {
				return item.date === pointer;
			});
			var periods = exc.length ? exc[0].periods : config.week[date.getDay()].periods;
			periods.forEach(function (period) {
				var start = new Date(date);
				start.setHours(...decimalToTime(period[0]));
				var end = new Date(date);
				end.setHours(...decimalToTime(period[1]));
				const offset = ((start.getHours() - 10) * 13 * 4) + 4;
				obj.get('title').addStyle({'margin-bottom': offset + 'px'});
				var hoursArray = [];
				while (start.getTime() <= end.getTime()) {
					hoursArray.push({label: (new cjs.Date(start)).format('TT:tt'), date: start, cssClass: ''});
					start = new Date(start.getTime()+ (config.calendarStep * 60 * 1000));
				}
				start.setHours(20,30,0,0);
				hoursArray.push({label: 'notas', date: new Date(start.getTime()), cssClass: 'memo'});

				hoursArray.forEach(function (e) {
					var hour = cjs.Component.create('hour', {config: e});
					hour.get().addListener('hour-add-event', function (e) {
						var { summary, processId, room, date, edit } = e.data;
						obj.addEvent({ processId, room, date, summary, edit });
					});
					hour.get().addListener('hour-modify-event', function (e) {
						var { userId, summary, id, processId, room, date, edit } = e.data;
						obj.get().fire('remove-event', {userId, id});
						obj.addEvent({ processId, room, date, summary, edit });
						config.calendar.delete(userId, id);
					});
					hour.get().addListener('paste-clipboard', obj.pasteClipboard);
					hour.createIn(obj.get());
					hours.push(hour);
				})
			});
		};

		return obj;
	}

}
