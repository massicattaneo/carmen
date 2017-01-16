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

        obj.submit = function (e) {
            e.preventDefault();
        };

        obj.emptyForm = function () {
            obj.get('name').setValue('');
            obj.get('surname').setValue('');
            obj.get('email').setValue('');
            obj.get('tel').setValue('');
        };

        return obj;
    }

}