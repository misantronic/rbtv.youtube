const React = require('react');
const _ = require('underscore');
const youtubeController = require('../../../utils/youtubeController');

/**
 * @class Thumbs
 */
class Thumbs extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onLike', '_onDislike', '_onRated');

        /** @type {{likeCount: Number, dislikeCount: Number}} */
        const statistics = props.statistics;
        const id = props.id;
        const liked = props.liked || false;
        const disliked = props.disliked || false;

        this.state = {
            liked,
            disliked,
            statistics
        };

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
                    <span className="count-dislikes" style={{ display: statistics.dislikeCount === null ? 'none' : 'inline' }}>{statistics.dislikeCount}</span>
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
        youtubeController
            .getRating(this.props.id)
            .then(rating => {
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

Thumbs.propTypes = {
    id: React.PropTypes.string,
    statistics: React.PropTypes.object,
    liked: React.PropTypes.bool,
    disliked: React.PropTypes.bool
};

module.exports = Thumbs;
