import Backbone from 'backbone';
import beans from '../beans';
import shows from '../shows';

const data = beans.concat(shows);

module.exports = Backbone.Collection.extend({
     initialize() {
         this.reset(data);
     }
});
