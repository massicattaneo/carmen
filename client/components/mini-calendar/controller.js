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
		var month, year;
        var obj = cjs.Component({
            template: template,
            style: style,
            config: config
        });

		function isWorkDay(date) {
			return date.getDay() !== 0 && date.getDay() !== 6
		}

		obj.setDate = function (date) {
			var m = date.getMonth() + 1, y = date.getFullYear(), d = date.getDate();
			month = m; year = y;
			var day = 1;
			var date = new Date(`${year}-${month}-${day}`);
			var today = new Date();
			obj.get('month').setValue((new cjs.Date(`${year}-${month}-${d}`)).format('mmmm yyyy'));
			today.setHours(0,0,0,0);
			[1,2,3,4,5,6].forEach(function (r) {
				[0,1,2,3,4,5,6].forEach(function (c) {
					var node = obj.get(`${r}_${c}`);
					node.setValue('');
					node.removeStyle('work');
					node.removeStyle('selected');
					node.removeStyle('old');
					node.setAttribute('data-day');
					if (c === date.getDay() && date.getMonth() === month-1) {
						if (d === date.getDate()) node.addStyle('selected');
						date = new Date(`${year}-${month}-${day}`);
						if (today.getTime() > date.getTime()) node.addStyle('old');
						if (isWorkDay(date)) {
							node.addStyle('work');
						}
						node.setValue(date.getDate());
						node.setAttribute('data-day', date.getDate());
						date = new Date(`${year}-${month}-${++day}`);
					}
				})
			})
		};

		obj.dayClick = function (e) {
			obj.get().fire('day-click', e.target.getAttribute('data-day'));
		};

        return obj;

    }

};
