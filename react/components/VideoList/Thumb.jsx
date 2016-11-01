const React = require('react');
const Component = React.Component;

class Thumb extends Component {
    render() {
        const videoId = this.props.videoId;
        const thumb = this.props.thumb;
        const publishedAt = this.props.publishedAt;

        return (
            <a className="link js-link" href={'#video/' + videoId}>
                <img className="thumb" src={thumb}/>
                <span className="publishedAt label label-default">{publishedAt.fromNow()}</span>
                <span className="duration js-duration label label-default"></span>
            </a>
        );
    }
}

module.exports = Thumb;
