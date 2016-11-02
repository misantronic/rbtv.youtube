const React = require('react');

module.exports = function Thumb(props) {
    const videoId = props.videoId;
    const thumb = props.thumb;
    const publishedAt = props.publishedAt;

    return (
        <a className="link js-link" href={'#video/' + videoId}>
            <img className="thumb" src={thumb}/>
            <span className="publishedAt label label-default">{publishedAt.fromNow()}</span>
            <span className="duration js-duration label label-default"></span>
        </a>
    );
};
