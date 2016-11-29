const backbone = require('backbone');
const beans = require('../beans');

const BeanModel = backbone.Model.extend({

});

module.exports = backbone.Collection.extend({
    model: BeanModel,

    initialize() {
        this.reset(beans.slice(0));
    }
});
