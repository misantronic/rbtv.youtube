import React from 'react';
import Loader from '../components/loader/Loader';

/**
 * @claas CollectionLoader
 */
class CollectionLoader extends React.Component {
    render() {
        return (
            <div className={'collection-loader-behavior' + (this.props.loading ? ' is-loading' : '')}>
                {this.props.children}
                <Loader/>
            </div>
        );
    }
}

module.exports = CollectionLoader;
