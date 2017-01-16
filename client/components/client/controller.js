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

        obj.showEdit = function () {
            var edit = cjs.Component.create('clientEdit', {config: {buttonText: 'guardar'}});
            edit.createIn(obj.get('client-edit-wrapper'));
            obj.get('client-view-wrapper').addStyle('hidden');
        };

        return obj;
    }

}