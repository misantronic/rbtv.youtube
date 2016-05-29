import {Radio} from 'backbone'

let channel = Radio.channel('breadcrumb');

channel.replace = function ({ title, route = null, index = null }) {
    channel.trigger('replace', { title, route, index });
};

channel.push = function ({ title, route = null, type = null }) {
    channel.trigger('push', { title, route, type });
};

export default channel;