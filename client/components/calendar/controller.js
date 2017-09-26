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
		var employee = ['Carmen', 'Carmen V.', 'Estefania', 'Cristina', 'Eila'];
		var isRequesting = false;
		var debounce = 20 * 1000;

		function setDate() {
			obj.get('date').setValue((new cjs.Date(date.getTime())).format('dddd dd mmmm yyyy'));
			obj.get('mini-calendar').setDate(date);
			employee.forEach(function (e) {
				var employ = obj.get(e);
				employ.clearEvents();
				employ.setDate(date);
				config.calendar.get(e, date).done(function (e) {
					employ.clearEvents();
					e.result.items.forEach(function (i) {
						var room = (new Date(i.end.dateTime).getTime() - new Date(i.start.dateTime).getTime()) / 1000 / 60 / 15;
						var hourId = ((new Date(i.start.dateTime)).getHours()-10) * 4 + Math.ceil((new Date(i.start.dateTime)).getMinutes() / 15);
						employ.drawEvent({ room, processId: i.description, hourId, label: i.summary, edit: false, id: i.id, start: new Date(i.start.dateTime) })
					})
				})
			});
		}

		obj.removeEvent = function (e) {
			obj.get(e.data.dayName).removeDrawEvent(e.data.id)
		};

		obj.init = function () {
			window.addEventListener('mousemove', function () {
				if (!isRequesting && obj.get().get().style.display === 'block') {
					isRequesting = true;
					setDate();
					setTimeout(function () {isRequesting = false;}, debounce);
				}

			});
		};

		obj.show = function () {
			obj.get().addStyle({ display: 'block' });
			if (!isRequesting) {
				isRequesting = true;
				setDate();
				setTimeout(function () {isRequesting = false;}, debounce);
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
