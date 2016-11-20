const React = require('react');
const _ = require('underscore');
const $ = require('jquery');

/**
 * @class BtnContextMenu
 */
class BtnContextMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        _.bindAll(this, '_onClick', '_onReady');
    }

    render() {
        return (
            <button className={'btn-context-menu btn btn-default'} onClick={this._onClick} ref={this._onReady}>
                <span className="glyphicon glyphicon-option-vertical"></span>
            </button>
        );
    }

    _onReady(el) {
        $(el).contextMenu(this.props.menu, {
            position: 'bottom',
            displayAround: 'trigger'
        });
    }

    _onClick() {

    }
}

BtnContextMenu.defaultProps = {
    menu: []
};

module.exports = BtnContextMenu;
