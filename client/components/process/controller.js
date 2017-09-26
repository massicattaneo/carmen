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
			var data = { processId:config.processId, room: config.room, label: config.processName, action: 'add' };
			ev.dataTransfer.setData("config", JSON.stringify(data));
        };


        return obj;
    }

}
