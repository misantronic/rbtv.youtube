const React = require('react');
const Component = React.Component;
const moment = require('moment');

const Link = require('./Thumb');
const Caption = require('./Caption');

class Item extends Component {
    constructor(props) {
        super(props);

        this._onClick = this._onClick.bind(this);

        this.state = {
            watched: false
        };
    }

    render() {
        const item = this.props.item;
        const videoId = item.contentDetails.upload.videoId;
        const thumb = item.snippet.thumbnails.high.url;
        const description = item.snippet.description;
        const title = item.snippet.title;
        const publishedAt = moment(item.snippet.publishedAt);

        const className = this._getClassName();

        return (
            <div key={item.id} className={className} onClick={this._onClick}>
                <div className="thumbnail">
                    <Link videoId={videoId} thumb={thumb} publishedAt={publishedAt}/>
                    <Caption videoId={videoId} description={description} title={title}/>
                </div>
            </div>
        );
    }

    _getClassName() {
        const index = this.props.index;

        let className = 'item col-xs-12 col-sm-4 collection-item collection-item-t-' + index;

        if (this.state.watched) {
            className += ' watched';
        }

        return className;
    }

    _onClick() {
        this.setState({
            watched: !this.state.watched
        });
    }
}

module.exports = Item;
