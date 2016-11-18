const React = require('react');
const _ = require('underscore');
const $ = require('jquery');

class BtnWatchLater extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        _.bindAll(this, '_onScrollTop', '_onScroll');
    }

    render() {
        return (
            <button className={'btn-to-top btn btn-primary' + (this.state.show ? ' show' : '')} title="Go to top" onClick={this._onScrollTop}>
                <span className="glyphicon glyphicon-chevron-up"></span>&nbsp;To top
            </button>
        );
    }

    componentDidMount() {
        $(window)
            .off('scroll.btnToTop')
            .on('scroll.btnToTop', this._onScroll);
    }

    componentWillUnmount() {
        $(window).off('scroll.btnToTop');
    }

    _onScrollTop(e) {
        $('html, body').animate({ scrollTop: 0 }, 500);

        e.preventDefault();
    }

    _onScroll() {
        const y = window.scrollY;

        this.setState({ show: y >= window.innerHeight });
    }
}

module.exports = BtnWatchLater;
