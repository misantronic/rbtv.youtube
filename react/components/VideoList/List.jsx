const React = require('react');
const Component = React.Component;
const Item = require('./Item');

class List extends Component {
    render() {
        const items = this.props.items;

        return (
            <div className="activities-items items row">
                {
                    items.map((item, i) =>
                        <Item key={item.id} item={item} index={i}/>
                    )
                }
            </div>
        );
    }
}

module.exports = List;
