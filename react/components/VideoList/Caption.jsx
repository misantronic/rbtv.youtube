const React = require('react');
const Component = React.Component;

class Caption extends Component {
    render() {
        const videoId = this.props.videoId;
        const description = this.props.description;
        const title = this.props.title;

        return (
            <div className="caption">
                <h3 className="title">
                    <a className="js-link" href={'#video/'+ videoId}>{title}</a>
                </h3>
                <p className="description">{description}</p>
            </div>
        );
    }
}

module.exports = Caption;
