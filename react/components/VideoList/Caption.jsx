const React = require('react');

module.exports = function Caption(props) {
    const videoId = props.videoId;
    const description = props.description;
    const title = props.title;

    return (
        <div className="caption">
            <h3 className="title">
                <a className="js-link" href={'#video/'+ videoId}>{title}</a>
            </h3>
            <p className="description">{description}</p>
        </div>
    );
};
