import _ from 'underscore';
import {CollectionView, CompositeView} from 'backbone.marionette'

var _insertAfterFn1 = CollectionView.prototype._insertAfter;
var _insertAfterFn2 = CompositeView.prototype._insertAfter;

function _insertAfter(method, childView) {
    // Ensure delay
    if (_.isUndefined(this._animateDelay)) {
        this._animateDelay = 0;
    }

    // Reset delay
    _.delay(() => {
        this._animateDelay = 0;
    }, 1300);

    childView.$el.css('opacity', 0);

    method.call(this, childView);

    this._animateDelay = Math.min(1200, this._animateDelay + 100);

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