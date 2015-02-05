var Dispatcher = require('project/shared/dispatcher');


/**
 * a bit more standardized way to dispatch actions
 * @param {String} actionType
 * @param {Object} [payload={}]
 * @returns {*}
 */
module.exports = function(actionType, payload) {
	console.log("inside dispatcher")
    payload = payload || {};
    payload.actionType = actionType;
    console.log(payload); 
    return Dispatcher.dispatch(payload)
};
