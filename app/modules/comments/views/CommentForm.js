import {LayoutView} from 'backbone.marionette'
import {Comment as CommentModel} from '../models/Comments'
import {props} from '../../decorators'
import youtubeController from '../../youtube/controller'

class CommentForm extends LayoutView {
    @props({
        className: 'layout-comment-form',

        template: require('../templates/comment-form.ejs'),

        model: new CommentModel(),

        ui: {
            text: '.js-text',
            submit: '.js-submit'
        },

        events: {
            'keyup @ui.text': '_onKeyupText',
            'keydown @ui.text': '_onKeydownText',
            'change @ui.text': '_onChangeText',
            'click @ui.submit': '_onClickSubmit'
        }
    })

    initialize() {
        const channelId = this.getOption('channelId');
        const videoId   = this.getOption('videoId');

        let snippet = this.model.get('snippet');

        snippet.channelId = channelId;
        snippet.videoId   = videoId;
    }

    _addComment() {
        this.ui.text.prop('disabled', true);
        this.ui.submit.prop('disabled', true);

        youtubeController.addComment(this.model, this._onCommentAdded.bind(this));
    }

    _onClickSubmit() {
        this._addComment();

        this.ui.submit.blur();
    }

    _onChangeText() {
        let snippet = this.model.get('snippet');
        let $text   = this.ui.text;

        snippet.topLevelComment.snippet.textOriginal = $text.val();

        $text
            .css('height', '')
            .css('height', $text[0].scrollHeight + 3);
    }

    _onCommentAdded(modelObj) {
        this.trigger('comment:add', new CommentModel(modelObj));

        this.model.reset();

        this.ui.text.prop('disabled', false).val('');
        this.ui.submit.prop('disabled', false);

        this._onChangeText();
    }

    /** @param {KeyboardEvent} event */
    _onKeyupText(event) {
        // KEY: CTRL + ENTER
        if (event.ctrlKey && event.keyCode === 13) {
            this._addComment();
        } else {
            this._onChangeText(event);
        }
    }

    _onKeydownText(event) {
        // KEY: CTRL + ENTER
        if (event.ctrlKey && event.keyCode === 13) {
            // Prevent new-line
            event.preventDefault();
        }
    }
}

export default CommentForm