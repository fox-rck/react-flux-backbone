var constants = require('./constants');
var dispatch = require('project/shared/helpers/dispatch');
var _ = require('underscore');


module.exports = {
    navigate: function(fragment, trigger, replace) {
    	console.log(fragment)
        dispatch(constants.ROUTE_NAVIGATE, {
            fragment: fragment,
            trigger: _.isUndefined(trigger) ? true : trigger,
            replace: _.isUndefined(replace) ? true : replace
        });
    }
};
