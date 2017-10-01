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

		obj.init = function () {
			obj.get().addStyle(`process-color-${config.processId}`)
		};

        obj.dragstart = function (ev) {
			var { processId , summary, room } = config;
			ev.dataTransfer.setData("config", JSON.stringify({ processId, room, summary, description: '', action: 'add' }));
        };


        return obj;
    }

}
