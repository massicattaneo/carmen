/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: controller
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

function controller() {

	return function (config) {
		var obj = {};
		var items = cjs.Collection();
		var fixedFilter = '';

		obj.populate = function (componentName, keys) {
			keys.forEach(function (key, index) {
				obj.addItem(componentName, key, index + 1);
			});
		};

		obj.emptyCollection = function () {
			items.each(function (i, k, o) {
				o.remove()
			});
			items.clear();
		};

		obj.each = function (callback) {
			items.each(callback);
		};

		obj.addItem = function (componentName, id, count) {
			var c = cjs.Component.create(componentName, { config: { id: id, count: count } });
			items.add(c, id);
			c.createIn(obj.get('collection').get());
			return cjs.Component.collectData();
		};

		obj.addItemByInfo = function (componentName, id, info, count) {
			var c = cjs.Component.create(componentName, { config: { id: id, count: count } });
			items.add(c, id);
			c.createIn(obj.get('collection').get());
			items.get(id.toString()).update(info);
		};

		obj.removeItem = function (id) {
			var key = id.toString();
			items.get(key).remove();
			items.remove(key);
		};

		obj.editItem = function (id, client) {
			items.get(id.toString()).showEdit(id, client);
		};

		obj.closeEdit = function () {
			items.forEach(function (c) {
				c.closeEdit()
			});
		};

		obj.resetFilter = function () {
			obj.get('filter').setValue('');
			obj.filter();
		};

		obj.setFixedFilter = function (flt) {
			fixedFilter = flt;
			obj.filter();
		};

		obj.filter = function () {
			var filterText = obj.get('filter').getValue().toLowerCase();
			var filter = isExpression(filterText) ? complexFilter(filterText, items) : normalFilter(filterText, items);
			if (filter.isEmpty() && filterText === '') filter = items.clone();
			if (fixedFilter !== '') {
				filter = complexFilter('filter: ' + fixedFilter, filter)
			}
			items.forEach(function (c) {
				c.get().removeStyle('visible')
			});
			filter.forEach(function (k) {
				k.get().addStyle('visible')
			});
			obj.get().fire('refresh', { keys: filter.keysToArray(), filterText: filterText });
		};

		obj.updateItem = function (info, id) {
			items.get(id.toString()).update(info);
		};

		function isExpression(filterText) {
			return filterText.substr(0, 7) === 'filter:';
		}

		function normalFilter(filterText, itms) {
			return itms.filter(function (c) {
				return c.get().getValue().toLowerCase().indexOf(filterText) !== -1
			});
		}

		function complexFilter(filterText, itms) {
			var array = filterText.substr(7).split(/&[^&]]/).map(function (f) {
				var values = f.split(/(=|>=|<=|>|<)/)
				return { key: values[0].trim(), value: values[2].trim(), expression: values[1].trim() }
			}).filter(function (f) {
				return f.key && f.value && f.expression;
			});

			return itms.filter(function (c) {
				return array.filter(function (f) {
						var value = c.get(f.key).getValue().toLowerCase();
						if (f.expression === '=') {
							var values = f.value.split('||');
							return values.indexOf(value) !== -1;
						} else {
							if (isDate(value) && isDate(f.value)) {
								return eval('date(value) '+f.expression+' date(f.value)');
							}
							if (isNumber(value) && isNumber(f.value)) {
								return eval('number(value) '+f.expression+' number(f.value)');
							}
							return false;
						}
					}).length === array.length
			});
		}

		function isNumber(str) {
			return !isNaN(str.replace('€', '').trim().replace('.', '').replace(',','.'))
		}
		function number(str) {
			return parseFloat(str.replace('€', '').trim().replace('.', '').replace(',','.'))
		}
		function isDate(str) {
			return str.split('-').reverse().join('-').isDate();
		}
		function date(str) {
			return new Date(str.split('-').reverse().join('-')).getTime();
		}

		return obj;
	}

}
