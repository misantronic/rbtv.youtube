import _ from 'underscore'
import {LayoutView} from 'backbone.marionette'
import {Comment as CommentModel} from '../models/Comments'
import {props} from '../../decorators'
import youtubeController from '../../youtube/controller'

class CommentForm extends LayoutView {
    constructor(options = {}) {
        if (!options.model) throw new Error('Please specify a model');

        super(options);
    }

    @props({
        className: 'layout-comment-form',

        template: require('../templates/comment-form.ejs'),

        ui: {
            text: '.js-text',
            submit: '.js-submit',
            cancel: '.js-cancel'
        },

        events: {
            'keyup @ui.text': '_onKeyupText',
            'keydown @ui.text': '_onKeydownText',
            'change @ui.text': '_onChangeText',
            'click @ui.submit': '_onClickSubmit'
        },

        triggers: {
            'click @ui.cancel': 'comment:cancel'
        }
    })
    
    onRender() {
        const canCancel = _.isUndefined(this.getOption('canCancel')) ? false : this.getOption('canCancel');
        
        if(canCancel) {
            this.ui.cancel.removeClass('hide');
        }
    }

    _addComment() {
        this.ui.text.prop('disabled', true);
        this.ui.submit.prop('disabled', true);

        youtubeController.addComment(this.model, modelObj => {
            this.trigger('comment:add', new CommentModel(modelObj));

            this.model.reset();

            this.ui.text.prop('disabled', false).val('');
            this.ui.submit.prop('disabled', false);

            this._onChangeText();
        });
    }

    _onClickSubmit() {
        this._addComment();

        this.ui.submit.blur();
    }

    _onChangeText() {
        let snippet = this.model.get('snippet');
        let $text   = this.ui.text;

        snippet.textOriginal = $text.val();

        $text
            .css('height', '')
            .css('height', $text[0].scrollHeight + 3);
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