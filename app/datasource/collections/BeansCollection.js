import backbone from 'backbone';
import beans from '../beans';

const BeanModel = backbone.Model.extend({

});

module.exports = backbone.Collection.extend({
    model: BeanModel,

    initialize() {
        this.reset(beans.slice(0));
    }
});
