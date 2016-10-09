import {ItemView} from 'backbone.marionette';

const ShowsListItem = ItemView.extend({
    className: 'item col-xs-12',

    template: require('../templates/show.ejs')
});

export default ShowsListItem;
