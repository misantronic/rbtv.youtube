import _ from 'underscore';
import {CollectionView, CompositeView} from 'backbone.marionette'

let _insertAfterFn1 = CollectionView.prototype._insertAfter;
let _insertAfterFn2 = CompositeView.prototype._insertAfter;

function _insertAfter(method, childView) {
    // Ensure delay
    if (_.isUndefined(this._animateDelay)) {
        this._animateDelay = 0;
    }

    // Reset delay
    _.delay(() => {
        this._animateDelay = 0;
    }, 1300);

    // Initial hide element
    childView.$el.css('opacity', 0);

    // Call original _insertAfter method
    method.call(this, childView);

    // Calculate delay
    this._animateDelay = Math.min(1200, this._animateDelay + 100);

    // FadeIn
    childView.$el.delay(this._animateDelay).animate({ opacity: 1 }, 150);
}

_.extend(CollectionView.prototype, {
    _insertAfter: function (childView) {
        _insertAfter.call(this, _insertAfterFn1, childView);
    }
});

_.extend(CompositeView.prototype, {
    _insertAfter: function (childView) {
        _insertAfter.call(this, _insertAfterFn2, childView);
    }
});