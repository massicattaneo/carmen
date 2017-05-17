/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: state-machine
 Created Date: 16 May 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2017.
 //////////////////////////////////////////////////////////////////////////////
 */

function stateMachine(imports) {

	var Stack = imports('js/stack.js');

	function toArray(uc) {
		var array = [];
		for (var k = 0; k < uc.children.length; k++) {
			var o = { exe: uc.children[k].tagName };
			for (var j = 0; j < uc.children[k].attributes.length; j++) {
				o[uc.children[k].attributes[j].name] = uc.children[k].attributes[j].value
			}
			o.children = uc.children[k];
			array.push(o)
		}
		return array;
	}

	return function (params, db, components) {

		var obj = {};
		var map = new cjs.Collection();

		var args = [];
		var parser = new DOMParser();
		var a = parser.parseFromString(params, "text/xml").firstChild;
		var array = Object.keys(a.children).map(function (k, i) {
			return a.children[k]
		});
		array.filter(function (o) {
			return o.tagName === 'uc'
		}).forEach(function (uc) {
			map.add(toArray(uc), uc.getAttribute('name'));
		});


		array.filter(function (o) {
			return o.tagName === 'event'
		}).forEach(function (event) {
			if (event.getAttribute('component')) {
				components[event.getAttribute('component')].get().addListener(event.getAttribute('on'), function (e) {
					args = [];
					e.data !== undefined && args.push(e.data);
					exe(toArray(event));
				})
			}
		});

		obj.enter = function (stateName) {
			args = [];
			return exe(map.get(stateName));
		};

		function exe(array) {
			const stack = new Stack();
			array.map(function (a) {
				switch (a.exe) {
					case 'reset-args':
						stack.run(function (next) {
							args= [];
							next()
						});
						break;
					case 'run':
						stack.run(function (next) {
							this.array.push(components[a.component][a.action].apply(null,args) || cjs.Need().resolve());
							this.array[this.array.length - 1].done(function () {
								arguments[0] !== undefined && args.push(arguments[0]);
								next()
							});
						});
						break;
					case 'wait':
						stack.run(function (next) {
							var when = a.until.split(',').map(o => o.trim());
							var all = when.map((o) => {
								if (isNaN(o)) {
									return this.array[Number(o.replace('id_', ''))];
								} else {
									var d = cjs.Need();
									setTimeout(d.resolve, Number(o));
									return d;
								}
							});
							this.array.push(cjs.Need(all));
							this.array[this.array.length - 1].done(next);
						});
						break;
					case 'read':
						stack.run(function (next) {
							if (a.path) {
								var p = a.path.split('/');
								if (p.length === 1) {
									args.push(db[p[0]]);
								} else {
									var result = Object.assign({}, db);
									p.forEach((prop) => {
										if (/{\d}/.test(prop)) {
											result = result[args[prop.match(/{(\d)}/)[1]]];
										} else {
											result = result[prop]
										}
									});
									args.push(result);
								}
							} else if (a.value) {
								args.push(a.value)
							}
							next();
						});
						break;
					case 'subtract':
						stack.run(function (next) {
							var p = a.path.split('/');
							var last = p.splice(p.length - 1, 1)[0];
							var result = Object.assign({}, db);
							p.forEach((prop) => {
								result = result[prop]
							});
							result[last] -= Number(a.value) || args[0];
							next();
						});
						break;
					case 'set':
						stack.run(function (next) {
							var p = a.path.split('/');
							if (p.length === 1) {
								var value = a.value;
								if (/{\d}/.test(value)) {
									value = args[value.match(/{(\d)}/)[1]];
								}
								db[p[0]] = isNaN(value) ? value : parseFloat(value);
							} else {
								var last = p.splice(p.length - 1, 1)[0];
								var result = Object.assign({}, db);
								p.forEach((prop) => {
									result = result[prop]
								});
								var value = a.value;
								if (/{\d}/.test(value)) {
									value = args[value.match(/{(\d)}/)[1]];
								}
								result[last] = isNaN(value) ? value : parseFloat(value);
							}
							next();
						});
						break;
					case 'if':
						stack.run(function (next) {
							if (a.path) {
								var p = a.path.split('/');
								var last = p.splice(p.length - 1, 1)[0];
								var result = Object.assign({}, db);
								p.forEach((prop) => {
									result = result[prop]
								});
								args.push(result)
							}
							if (eval(a.test
									.replace('{0}', "'" + args[0] + "'")
									.replace('{1}', "'" + args[1] + "'")
									.replace('{2}', "'" + args[2] + "'")
									.replace('{3}', "'" + args[3] + "'")
								)) {
								this.array.push(exe(toArray(a.children)));
								this.array[this.array.length - 1].done(next);
							} else {
								next()
							}
						});
						break;
					case 'call':
						stack.run(function (next) {
							this.array.push(obj.enter(a.uc));
							this.array[this.array.length - 1].done(next);
						});
						break;
				}
			});
			var d = cjs.Need();
			stack.go(d.resolve);
			return d;
		}

		return obj;
	}

}
