import {Radio} from 'backbone'

let breadcrumbChannel = Radio.channel('breadcrumb');

breadcrumbChannel.replace = function ({ title, route = null, index = null }) {
    breadcrumbChannel.trigger('replace', { title, route, index });
};

breadcrumbChannel.push = function ({ title, route = null, type = null }) {
    breadcrumbChannel.trigger('push', { title, route, type });
};

export default {
    breadcrumb: breadcrumbChannel
}