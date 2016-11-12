const React = require('react');
const _ = require('underscore');
const youtubeController = require('../../../utils/youtubeController');

class ThumbsComponent extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onLike', '_onDislike', '_onRated');

        const statistics = props.statistics;
        const id = props.id;

        this.state = {
            liked: props.liked || false,
            disliked: props.disliked || false,
            statistics
        };

        youtubeController.init();

        if (id) {
            this._getRating();
        }
    }

    /**
     * Lifecycle methods
     */

    render() {
        const statistics = this.state.statistics;

        return (
            <div className="component-thumbs">
                <button className={'btn-like' + (this.state.liked ? ' is-active' : '')} onClick={this._onLike}>
                    <span className="icon-thumbs-up"></span>
                    <span className="count-likes">{statistics.likeCount}</span>
                </button>
                <button className={'btn-dislike' + (this.state.disliked ? ' is-active' : '')} onClick={this._onDislike}>
                    <span className="icon-thumbs-down"></span>
                    <span className="count-dislikes">{statistics.dislikeCount}</span>
                </button>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (this._propHasChanged(prevProps, 'statistics')) {
            const statistics = this.props.statistics;

            this.setState({ statistics });
        }

        if (this._propHasChanged(prevProps, 'id')) {
            this._getRating();
        }
    }

    /**
     * Private methods
     */

    _getRating() {
        youtubeController.getRating(this.props.id, rating => {
            this.setState({
                liked: rating === 'like',
                disliked: rating === 'dislike'
            });
        });
    }

    _propHasChanged(prevProps, prop) {
        return prevProps[prop] !== this.props[prop];
    }

    _onLike() {
        const rating = this.state.liked ? 'none' : 'like';

        youtubeController
            .addRating(rating, this.props.id)
            .done(this._onRated);
    }

    _onDislike() {
        const rating = this.state.disliked ? 'none' : 'dislike';

        youtubeController
            .addRating(rating, this.props.id)
            .done(this._onRated);
    }

    _onRated(rating) {
        const statistics = this.props.statistics;
        const liked = rating === 'like';
        const disliked = rating === 'dislike';
        const none = rating === 'none';

        if (liked) {
            statistics.likeCount++;

            if (this.state.disliked) {
                statistics.dislikeCount--;
            }
        }

        if (disliked) {
            statistics.dislikeCount++;

            if (this.state.liked) {
                statistics.likeCount--;
            }
        }

        if (none) {
            if (this.state.liked) {
                statistics.likeCount--;
            }

            if (this.state.disliked) {
                statistics.dislikeCount--;
            }
        }

        this.setState({
            statistics,
            liked,
            disliked
        });
    }
}

module.exports = ThumbsComponent;
