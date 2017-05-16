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

		obj.saveTransaction = function () {
			var data = {
				value: parseFloat(obj.get('value').getValue()),
				type: obj.get('type').getValue(),
				description: obj.get('description').getValue()
			};
			obj.get().fire('transaction-add', data)
		};

        return obj;
    }

}
