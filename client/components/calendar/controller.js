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
		var date = new Date();
		var users = {};
		var isRequesting = false;
		var debounce = 30 * 1000;
		var isEditing = false;

		function setDate() {
			obj.get('date').setValue((new cjs.Date(date.getTime())).format('dddd dd mmmm yyyy'));
			obj.get('mini-calendar').setDate(date);
			Object.keys(users).forEach(function (userId) {
				var day = users[userId].component;
				day.clearEvents();
				day.setDate(date);
				config.calendar.get(users[userId].id, date).done(function (e) {
					day.clearEvents();
					e.result.items.forEach(function (i) {
						var room = (new Date(i.end.dateTime).getTime() - new Date(i.start.dateTime).getTime()) / 1000 / 60 / 15;
						day.drawEvent({
							room,
							processId: i.extendedProperties ? i.extendedProperties.private.processId : (config.processes.find(a=>a.summary === i.summary.toLowerCase()) || {processId: 98}).processId,
							description: i.description,
							summary: i.summary,
							edit: false,
							id: i.id,
							start: new Date(i.start.dateTime)
						})
					})
				})
			});
		}

		function editMode(e) {
			isEditing = e.data;
		}

		obj.removeEvent = function (e) {
			users[e.data.userId].component.removeDrawEvent(e.data.id);
		};

		obj.init = function () {
			config.processes.forEach(function({processId, summary, room}) {
				var process = cjs.Component.create('process', {
					config: { processId , summary, room }
				});
				process.createIn(obj.get('processes'));
			});
			config.users.forEach(function({title, id, week}) {
				var component = cjs.Component.create('day', {config: { userId: id, title, week }});
				component.get().addListener('remove-event', obj.removeEvent);
				users[id] = {title, id, component, week};
				component.get().addListener('edit-mode', editMode);
				component.createIn(obj.get('days'));
			});
			window.addEventListener('mousemove', function () {
				if (!isRequesting && obj.get().get().style.display === 'block' && !isEditing) {
					isRequesting = true;
					setDate();
					setTimeout(function () {
						isRequesting = false;
					}, debounce);
				}

			});
		};

		obj.show = function () {
			obj.get().addStyle({display: 'block'});
			if (!isRequesting) {
				isRequesting = true;
				setDate();
				setTimeout(function () {
					isRequesting = false;
				}, debounce);
			}
		};

		obj.prevMonth = function () {
			date.setMonth(date.getMonth() - 1);
			setDate();
		};

		obj.nextMonth = function () {
			date.setMonth(date.getMonth() + 1);
			setDate();
		};

		obj.nextWeek = function () {
			date.setDate(date.getDate() + 7);
			setDate();
		};

		obj.prevWeek = function () {
			date.setDate(date.getDate() - 7);
			setDate();
		};

		obj.prevDay = function () {
			date.setDate(date.getDate() - 1);
			setDate();
		};

		obj.nextDay = function () {
			date.setDate(date.getDate() + 1);
			setDate();
		};

		obj.today = function () {
			date = new Date();
			setDate();
		};

		obj.changeDay = function (e) {
			if (e.data) {
				date.setDate(e.data);
				setDate();
			}
		};

		return obj;

	}

};
