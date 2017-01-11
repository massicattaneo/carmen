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
            var key = addClient(obj.toJSON());
            emptyForm();
            obj.get().fire('refresh', {isEmpty: false, key: key});
        };

        function emptyForm() {
            obj.get('name').setValue('');
            obj.get('surname').setValue('');
            obj.get('email').setValue('');
            obj.get('tel').setValue('');
        }

        function addClient(p){
            var storesRef = firebase.database().ref().child('clients');
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                name: p.name,
                surname: p.surname,
                email: p.email,
                tel: p.tel
            });
            return newStoreRef.key;
        }

        return obj;
    }

}