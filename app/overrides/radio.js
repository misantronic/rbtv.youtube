import channels from '../channels'

function radioMixin() {
    var radioOptions = _.result(this, 'Radio');

    if (radioOptions) {
        // Iterate over options which are the individual channels
        _.each(radioOptions, (events, channelStr) => {
            // Get the actual Radio.channel-object
            const channel = channels[channelStr];

            if (!channel) {
                throw new Error(channelStr + '-channel does not exist.');
            }

            // Iterate over events
            _.each(events, (handler, event) => {
                if (_.isString(handler)) {
                    // Lookup handler in context
                    handler = this[handler];
                }

                this.listenTo(channel, event, handler);
            });
        });
    }
}

export {radioMixin}