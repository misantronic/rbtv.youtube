const Backbone = require('backbone');
const beans = require('../beans');
const shows = require('../shows');

const data = beans.concat(shows);

module.exports = Backbone.Collection.extend({
     initialize() {
         this.reset(data);
     }
});
