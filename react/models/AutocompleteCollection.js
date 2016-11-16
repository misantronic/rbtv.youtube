const Backbone = require('backbone');
const beans = require('../data/beans');
const shows = require('../data/shows');

const data = beans.concat(shows);

module.exports = Backbone.Collection.extend({
     initialize() {
         this.reset(data);
     }
});
