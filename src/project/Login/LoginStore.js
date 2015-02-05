var Backbone = require('backbone');
var Store = require('project/shared/libs/Store');
var constants = require('./constants');


var User = Backbone.Model.extend({
    defaults: {
        UN:"",
        PW:"",
        isAuthenticated:false
    }
});


class AppUserCollection extends Store.Collection {
    constructor() {
        this.model = User;
        super();
    }

    handleDispatch(payload) {
        switch(payload.actionType) {
            case constants.USER_AUTHENTICATE:
            console.alert("AUTHENTICATE inside store")
                break;
            case constants.USER_AUTHENTICATED:
            console.log("AUTHENTICATED inside store");
                break;
        }
    }
}

module.exports = new AppUserCollection();
