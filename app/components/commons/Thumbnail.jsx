const React = require('react');

/**
 * @class Thumbnail
 */
class Thumbnail extends React.Component {
    render() {
        const { labelLeft, labelRight, badge } = this.props;

        return (
            <div className="thumbnail">
                <a className="link" href={this.props.link}>
                    <img className="thumb" src={this.props.image}/>
                    {labelLeft}
                    {labelRight}
                </a>
                <div className="caption">
                    <h3 className="title">
                        <a className="link" href={this.props.link} title={this.props.title}>{this.props.title}</a>
                        {badge}
                    </h3>
                    <p className="description">
                        {this.props.description.split('\n').map((item, i) => <span key={i}>{item}<br/></span>)}
                    </p>
                </div>
                {this.props.children}
            </div>
        );
    }
}

Thumbnail.defaultProps = {
    labelLeft: '',
    labelRight: '',
    badge: ''
}

module.exports = Thumbnail;
