import React from 'react';
import _ from 'underscore';
import $ from 'jquery';
import Beans from '../../datasource/collections/BeansCollection';

/**
 * @class Tags
 */
class Tags extends React.Component {
    constructor(props) {
        super(props);

        _.bindAll(this, '_onClick');
    }

    render() {
        const tags = this.props.tags;

        if (tags.length === 0) return <div></div>;

        const beans = new Beans();
        const names = _.iintersection(beans.map(bean => bean.get('title')), tags);

        return (
            <div className="component-tags">
                {names.map((name, i) =>
                    <span className="label label-primary"
                          key={i}
                          onClick={this._onClick}>
                        {name.substr(0, 1).toUpperCase() + name.substr(1)}
                    </span>)
                }
            </div>
        );
    }

    _onClick(e) {
        const val = $(e.target).text();

        if (this.props.onTagSelect) {
            this.props.onTagSelect(val);
        }
    }
}

Tags.defaultProps = {
    tags: []
};

module.exports = Tags;
