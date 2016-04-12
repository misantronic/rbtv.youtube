import {Radio} from 'backbone'

let breadcrumbChannel = Radio.channel('breadcrumb');

/**
 * @param title
 * @param [route]
 */
breadcrumbChannel.replace = function (title, route) {
    breadcrumbChannel.trigger('replace', { title, route });
};

/**
 * @param title
 * @param [route]
 */
breadcrumbChannel.push = function (title, route) {
    breadcrumbChannel.trigger('push', { title, route });
};

export default {
	breadcrumb: breadcrumbChannel
}