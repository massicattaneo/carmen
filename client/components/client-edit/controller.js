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
            addClient(obj.toJSON());
            obj.get().fire('refresh', {isEmpty: false});
        };

        function addClient(p){
            var storesRef = firebase.database().ref().child('clients');
            var newStoreRef = storesRef.push();
            newStoreRef.set({
                name: p.name,
                surname: p.surname,
                email: p.email,
                tel: p.tel
            });
        }

        return obj;
    }

}