import $ from 'jquery';
import {Collection} from 'backbone';
import Config from '../../../Config';
import VideoModel from './Video';

const Videos = Collection.extend({
    model: VideoModel,

    /**
     * @param {Array} val
     * @returns {Videos}
     */
    setVideoIds(val) {
        this._videoIds = val;

        return this;
    },

    url() {
        return Config.endpoints.videos + '?' + $.param([
                { name: 'id', value: this._videoIds.join(',') }
            ]);
    },

    initialize() {
        this.setVideoIds([]);
    }
});

export default Videos;
