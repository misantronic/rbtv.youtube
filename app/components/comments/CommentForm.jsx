import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import youtubeController from '../../utils/youtubeController';
import Config from '../../Config';

/**
 * @class CommentForm
 */
class CommentForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        _.bindAll(this, '_onSubmit', '_onTextChange', '_onKeyUp');

        const model = this.props.model.clone();
        const snippet = model.get('snippet');

        this.state = {
            model,
            loading: false,
            text: snippet.textOriginal || snippet.textDisplay
        };
    }

    render() {
        const loading = this.state.loading;

        return (
            <form className="component-comment-form" onSubmit={this._onSubmit}>
                <textarea disabled={loading} className="form-control" value={this.state.text} onChange={this._onTextChange} onKeyUp={this._onKeyUp}></textarea>
                <button disabled={loading} type="submit" className="btn btn-primary">Send</button>
            </form>
        );
    }

    componentWillUnmount() {
        if (this._submitXhr) {
            this._submitXhr.abort();
        }
    }

    _onTextChange(e) {
        const text = e.target.value;
        /** @type {Object} */
        const snippet = this.state.model.get('snippet');

        snippet.textOriginal = text;
        snippet.textDisplay = text;

        this.setState({ text });
    }

    _onSubmit(e) {
        e.preventDefault();

        this.setState({ loading: true }, () => {
            const method = this.props.method;

            this._submitXhr = youtubeController[method](this.state.model);
            this._submitXhr.then(data => {
                this.setState({
                    loading: false,
                    text: ''
                });

                $.when([
                    youtubeController.invalidateComments(`commentThreads.${this.context.videoId}`),
                    youtubeController.invalidateComments(`comments.${this.context.videoId}`)
                ]).done(() => {
                    if (this.props.onComment) {
                        this.props.onComment(data);
                    }
                });
            });
        });
    }

    _onKeyUp(e) {
        if (e.keyCode === 27) { // esc
            this.setState({
                loading: false,
                text: ''
            });

            if (this.props.onAbort) {
                this.props.onAbort();
            }
        }
    }
}

CommentForm.defaultProps = {
    method: 'addComment'
};

CommentForm.contextTypes = {
    videoId: React.PropTypes.string
};

module.exports = CommentForm;
