const Backbone = require('backbone');
const $ = require('jquery');
const React = require('react');
const Component = React.Component;
const Item = require('./Item');

class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collection: new Backbone.Collection()
        };

        this.fetch();
    }

    render() {
        const collection = this.state.collection;

        this._initScroll();

        return (
            <div className="activities-items items row">
                {
                    collection.map((item, i) =>
                        <Item key={item.id} item={item} index={i}/>
                    )
                }
            </div>
        );
    }

    fetch() {
        const collection = this.props.collection;

        const token = collection.getNextPageToken();

        if (token) {
            this._killScroll();
        }

        collection
            .fetch()
            .then(() => this.setState({ collection }));
    }

    /**
     * Private methods
     */

    _initScroll() {
        this._killScroll();

        $(window).on('scroll.activities', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.activities');
    }

    /**
     * Event handler
     */

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y = window.scrollY;

        if (y >= maxY) {
            this.fetch();
        }
    }
}

module.exports = List;
