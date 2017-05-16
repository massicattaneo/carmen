/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: stack
 Created Date: 16 May 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2017.
 //////////////////////////////////////////////////////////////////////////////
 */

function Stack() {

	return function () {
		var obj = this;
		obj.array = [];

		obj.run= function(fn) {
			this.go = (function (stack) {
				return function (next) {
					stack.call(obj, function () {
						fn.call(obj, function () {
							next.call(obj)
						});
					});
				}.bind(this);
			})(this.go);
		};

		obj.go = function(next) {
			next();
		}
	}

}
