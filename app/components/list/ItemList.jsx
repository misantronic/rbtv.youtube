import React from 'react';
import _ from 'underscore';
import CollectionLoader from '../../behaviors/CollectionLoader';
import CollectionScrolling from '../../behaviors/CollectionScrolling';

class ItemList extends React.Component {

    /**
     * Lifecycle methods
     */

    render() {
        let fadeIndex = 0;
        const { loading, fetched, uid, children } = this.props;

        return (
            <CollectionScrolling loading={loading} fetched={fetched} uid={uid} onUpdate={this._onFetch.bind(this)}>
                <CollectionLoader loading={loading}>
                    <div className="component-videolist items">
                        {children.map((child, i) => {
                            if (i % 30 === 0) fadeIndex = 0;

                            return React.cloneElement(child, {
                                fadeIndex: fadeIndex++
                            });
                        })}
                    </div>
                </CollectionLoader>
            </CollectionScrolling>
        );
    }

    /**
     * Private methods
     */

    _onFetch(reset = false) {
        this.props.onFetch(reset);
    }
}

ItemList.propTypes = {
    uid: React.PropTypes.string.isRequired, // A unique string
    onFetch: React.PropTypes.func,
    loading: React.PropTypes.bool,
    fetched: React.PropTypes.bool
};

ItemList.defaultProps = {
    onFetch: _.noop,
    loading: false,
    fetched: false
};

export default ItemList;
