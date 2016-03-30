import $ from 'jquery'
import _ from 'underscore'
import {CompositeView, ItemView} from 'backbone.marionette'
import {Model} from 'backbone'

class Activity extends ItemView {
    get className() {
        return 'item col-xs-12 col-sm-4';
    }

    get template() {
        return require('../templates/activity.ejs');
    }

    onRender() {
        this.stickit();
    }
}

class Activities extends CompositeView {
    constructor(options) {
        _.defaults(options, {
            model: new Model({
                _filterByRBTV: true,
                _filterByLP: true,
                _showBtnToTop: false,
                _loading: false
            })
        });

        super(options);
    }

    events() {
        return {
            'click @ui.btnToTop': (e) => {
                $('html, body').animate({ scrollTop: 0 }, 500);

                e.preventDefault();
            }
        }
    }

    modelEvents() {
        return {}
    }

    ui() {
        return {
            btnToTop: '.js-btn-to-top',
            loader: '.js-loader'
        }
    }

    bindings() {
        return {
            '@ui.btnToTop': {
                classes: {
                    show: '_showBtnToTop'
                }
            },

            '@ui.loader': {
                classes: {
                    show: '_loading'
                }
            }
        }
    }

    get className() {
        return 'layout-activities'
    }

    get childView() {
        return Activity;
    }

    get childViewContainer() {
        return '.js-activities'
    }

    get template() {
        return require('../templates/activities.ejs');
    }

    onRender() {
        this._initScroll();

        this.stickit();
    }

    onDestroy() {
        this._killScroll();
    }

    _initScroll() {
        $(window).on('scroll.activities', this._onScroll.bind(this));
    }

    _killScroll() {
        $(window).off('scroll.activities');
    }

    _fetchNext() {
        if (this.collection.nextPageToken) {
            this.model.set('_loading', true);

            this.collection.fetch()
                .done(() => {
                    this.model.set('_loading', false);
                    this.render();
                });
        }
    }

    _onScroll() {
        const maxY = $(document).height() - window.innerHeight - 800;
        const y    = window.scrollY;

        if (y >= maxY) {
            this._killScroll();
            this._fetchNext();
        }

        this.model.set('_showBtnToTop', y >= window.innerHeight)
    }
}

export default Activities