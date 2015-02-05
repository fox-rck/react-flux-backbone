'use strict';

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

  
var Todo = Backbone.Model.extend({
    defaults: {
        text: "Default todo text",
        complete: false,
        saved:true
    },
    toggleComplete: function() {
        this.set({ complete: !this.get('complete') });
    },
    toggleSaved: function() {
        this.set({ saved: !this.get('saved') });
    }
});

module.exports = Todo;
