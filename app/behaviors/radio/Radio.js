import {Behavior} from 'backbone.marionette'
import _ from 'underscore'

class Radio extends Behavior {
    initialize() {
        _.each(this.options, (events, channel) => {
            _.each(events, (handler, event) => {
                if (_.isString(handler)) {
                    handler = this.view[handler];
                }

                this.view.listenTo(channel, event, handler);
            });
        });
    }
}

export default Radio