import {Collection, Model} from 'backbone';
import beans from '../../app/data/beans';

const BeanModel = Model.extend({

});

export default Collection.extend({
    model: BeanModel,

    initialize() {
        this.reset(beans.slice(0));
    }
});
