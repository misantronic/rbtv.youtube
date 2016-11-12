const React = require('react');
const _ = require('underscore');
const Beans = require('../../models/Beans');

class TagsComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const tags = this.props.tags;

        if (tags.length === 0) return <div></div>;

        const beans = new Beans();
        const names = _.iintersection(beans.map(bean => bean.get('title')), tags);

        return (
            <div className="component-tags">
                {names.map((name, i) => <span key={i}>{name}</span>)}
            </div>
        );
    }
}

TagsComponent.defaultProps = {
    tags: []
};

module.exports = TagsComponent;
