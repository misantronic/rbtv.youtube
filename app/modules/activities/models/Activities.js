import $ from 'jquery';
import {Collection} from 'backbone';
import Config from '../../../Config';
import ActivityModel from './Activity';

class Activities extends Collection {
    constructor(...args) {
        super(...args);

        this.model = ActivityModel;
    }

    setChannelId(val) {
        this._channelId = val;

        return this;
    }

    setNextPageToken(val) {
        this._nextPageToken = val;

        return this;
    }

    getNextPageToken() {
        return this._nextPageToken;
    }

    url() {
        return Config.endpoints.activities + '?' + $.param([
                { name: 'channelId', value: this._channelId },
                { name: 'pageToken', value: this._nextPageToken }
            ]);
    }

    parse(response) {
        this._nextPageToken = response.nextPageToken;

        return this.models.concat(response.items);
    }
}

export default Activities;
