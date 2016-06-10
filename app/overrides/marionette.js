import _ from 'underscore';
import {CollectionView, CompositeView} from 'backbone.marionette'
import {View} from 'backbone'
import {radioMixin} from './radio'

/**
 * Animated CollectionView inserts
 */

const _insertAfterFn1 = CollectionView.prototype._insertAfter;
const _insertAfterFn2 = CompositeView.prototype._insertAfter;

function _insertAfter(method, childView) {
    // Ensure delay
    if (_.isUndefined(this._insertAfterAnimateDelay)) {
        this._insertAfterAnimateDelay = 16;
    }

    // Reset delay
    _.delay(() => {
        this._insertAfterAnimateDelay = 16;
    }, 1400);

    // Initial hide element
    childView.$el.addClass('collection-item is-transparent');

    // Call original _insertAfter method
    method.call(this, childView);

    // Calculate delay
    this._insertAfterAnimateDelay = Math.min(1200, this._insertAfterAnimateDelay + 200);

    // FadeIn
    _.delay(() => {
        childView.$el.removeClass('is-transparent');
    }, this._insertAfterAnimateDelay);
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

/**
 * RADIO
 */

const Marionette = require('backbone.marionette');

// Get Marionette.Object prototype
const MarionetteObject = Marionette.Object;
const MarionetteObjectPrototype = MarionetteObject.prototype;

// GEt Marionette.View prototype
const MarionetteViewPrototype = Marionette.View.prototype;
const MarionetteViewPrototypeConstructor = MarionetteViewPrototype.constructor;

/**
 * RADIO - Marionette.View
 */

MarionetteViewPrototype.constructor = function() {
    MarionetteViewPrototypeConstructor.apply(this, arguments);

    radioMixin.call(this);
};

Marionette.View = View.extend(MarionetteViewPrototype);

/**
 * RADIO - Marionette.Object
 */

Marionette.Object = function () {
    MarionetteObject.apply(this, arguments);

    radioMixin.call(this);
};

Marionette.Object.extend = Marionette.extend;
Marionette.Object.prototype = MarionetteObjectPrototype;

/**
 *
 */

function attachElContent(html) {
    if(_.isString(html)) {
        this.$el[0].innerHTML = html;
    } else {
        this.$el.html(html);
    }

    return this;
}

Marionette.ItemView.prototype.attachElContent = attachElContent;
Marionette.CompositeView.prototype.attachElContent = attachElContent;