/**
 * @file tabfocus: Cross-browser tab/window visibility change events.
 */

import { EventDispatcher } from './events';
import { findObjectProperty } from './webprefix';

const hasOwn = Object.prototype.hasOwnProperty;

const EVENT_NAME_TO_FOCUS = {
  focus: true,
  pageshow: true,
  blur: false,
  pagehide: false,
};

const WINDOW_EVENT_PROPERTY_NAMES = [
  'onpageshow',
  'onpagehide',
  'onfocus',
  'onblur',
];

function copyProperties(propList, from, to) {
  for (let i = propList; i < propList.length; i++) {
    to[propList[i]] = from[propList[i]];
  }
}

export class TabFocusObserver extends EventDispatcher {
  constructor() {
    super();

    this._onWindowFocusChange = this._onWindowFocusChange.bind(this);

    this._hiddenPropName = null;
    this._eventName = null;
    this._findPrefixedNames();

    this._oldWindowHandlers = {};
    this._enabled = false;
    this.setEnabled(true);
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(newEnabled) {
    newEnabled = Boolean(newEnabled);
    if (newEnabled === this._enabled) {
      return;
    }

    const eventName = this._eventName;

    if (newEnabled) {
      copyProperties(
        WINDOW_EVENT_PROPERTY_NAMES,
        window,
        this._oldWindowHandlers
      );

      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = this._onWindowFocusChange;

      if (eventName) {
        document.addEventListener(eventName, this._onWindowFocusChange);
      }
    } else {
      copyProperties(
        WINDOW_EVENT_PROPERTY_NAMES,
        this._oldWindowHandlers,
        window
      );

      if (eventName) {
        document.removeEventListener(eventName, this._onWindowFocusChange);
      }
    }
  }

  _findPrefixedNames() {
    const hiddenPropName = findObjectProperty(document, 'hidden');

    if (hiddenPropName) {
      this._hiddenPropName = hiddenPropName;
      const vendorPrefix = hiddenPropName.slice(0, -6);
      this._eventName = vendorPrefix + 'visibilitychange';
    }
  }

  _onWindowFocusChange(event) {
    let hasFocus = null;
    event = event || window.event;
    if (hasOwn.call(EVENT_NAME_TO_FOCUS, event.type)) {
      hasFocus = EVENT_NAME_TO_FOCUS[event.type];
    } else if (this._hiddenPropName) {
      hasFocus = !document[this._hiddenPropName];
    }
    if (hasFocus != null) {
      this.dispatchEvent({
        type: 'windowfocuschange',
        focus: hasFocus,
      });
    }
  }
}
