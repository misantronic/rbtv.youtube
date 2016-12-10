import React from 'react';
import _ from 'underscore';
import youtubeController from '../../../utils/youtubeController';

/**
 * @class Thumbs
 */
class Thumbs extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onLike', '_onDislike', '_onRated');

        /** @var {{likeCount: Number, dislikeCount: Number}} statistics */
        const { statistics, id, liked, disliked } = props;

        this.state = { liked, disliked, statistics };

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

    componentWillUnmount() {
        if (this._ratingXhr && this._ratingXhr.abort) {
            this._ratingXhr.abort();
        }
    }

    /**
     * Private methods
     */

    _getRating() {
        this._ratingXhr = youtubeController.getRating(this.props.id);
        this._ratingXhr.then(rating => {
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

Thumbs.defaultProps = {
    liked: false,
    disliked: false
};

Thumbs.propTypes = {
    id: React.PropTypes.string,
    statistics: React.PropTypes.object,
    liked: React.PropTypes.bool,
    disliked: React.PropTypes.bool
};

module.exports = Thumbs;
