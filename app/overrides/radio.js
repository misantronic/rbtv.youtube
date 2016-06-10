import channels from '../channels'

function radioMixin() {
    var channels = _.result(this, 'channels');

    if (channels) {
        // Iterate over options which are the individual channels
        _.each(channels, (events, channelStr) => {
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