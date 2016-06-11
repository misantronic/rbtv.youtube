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
    if (!this._insertAfterAnimateCnt) {
        // Reset counter
        _.delay(() => {
            this._insertAfterAnimateCnt = null
        }, 800);
    }

    // Ensure animation-counter
    this._insertAfterAnimateCnt = this._insertAfterAnimateCnt || 1;

    // Initial hide element
    childView.$el.addClass('collection-item is-transparent collection-item-t-' + this._insertAfterAnimateCnt);

    // Call original _insertAfter method
    method.call(this, childView);

    // FadeIn
    _.delay(() => childView.$el.removeClass('is-transparent'), 0);

    this._insertAfterAnimateCnt++;
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

MarionetteViewPrototype.constructor = function () {
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
 * Optimize attachElContent
 */

function attachElContent(html) {
    if (_.isString(html)) {
        this.$el[0].innerHTML = html;
    } else {
        this.$el.html(html);
    }

    return this;
}

Marionette.ItemView.prototype.attachElContent = attachElContent;
Marionette.CompositeView.prototype.attachElContent = attachElContent;

/**
 * Fade-in regions attachHtml
 */

function attachHtml(view) {
    this.$el.contents().detach();

    view.$el.addClass('region-item is-transparent');

    this.el.appendChild(view.el);

    // FadeIn
    _.delay(() => view.$el.removeClass('is-transparent'), 0);
}

Marionette.Region.prototype.attachHtml = attachHtml;