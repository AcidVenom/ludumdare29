var GameObject = function () {
    var rtn = {
        __z: 0,
        preUpdate: function (data) {
            
        },
        postUpdate: function (data) {
            for (var x = 0; x < objects[i].children.length; x++) {
                objects[i].children[i].update(data);
            }
        },
        setZ: function (z) {
            this.__z = Sugar.isNumber(z) ? z : this.__z;
            Game.sort();
            return this.__z;
        },
        getZ: function () {
            return this.__z;
        }
    };

    return rtn;
};