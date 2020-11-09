import { CallbackSet } from './CallbackSet';
import { Event } from './Event';

function getListenersForType(instance, type) {
  return instance.__yced.listeners[type];
}

function addKeyedEventListener(instance, type, key, value) {
  const listeners = instance.__yced.listeners;
  const callbackSet = listeners[type] || (listeners[type] = new CallbackSet());
  callbackSet.add(key, value);
}

function spread(instance, method, typeOrMap, func) {
  if (typeof typeOrMap === 'string') {
    const allEventTypes = typeOrMap.split(' ');
    for (const type of allEventTypes) {
      method.call(instance, type, func);
    }
  } else {
    const typeToFuncMap = typeOrMap;
    for (const type of Object.keys(typeToFuncMap)) {
      method.call(instance, type, typeToFuncMap[type]);
    }
  }
}

export class EventDispatcher {
  constructor(eventTarget = null) {
    // could use WeakMap[this] to store this
    this.__yced = {
      listeners: {},
      target: eventTarget || this,
    };
  }

  hasEventListener(type, func) {
    const callbackSet = getListenersForType(this, type);
    return Boolean(callbackSet && callbackSet.has(func));
  }

  addEventListener(type, func) {
    addKeyedEventListener(this, type, func, func);
  }

  addOneTimeEventListener(type, func) {
    const invokeAndRemove = (event) => {
      func(event);
      this.removeEventListener(type, invokeAndRemove);
    };

    addKeyedEventListener(this, type, func, invokeAndRemove);
  }

  removeEventListener(type, func) {
    const callbackSet = getListenersForType(this, type);
    if (callbackSet) {
      callbackSet.delete(func);
    }
  }

  removeEventListenersByType(type) {
    const listeners = this.__yced.listeners;
    const callbackSet = listeners[type];
    if (callbackSet) {
      callbackSet.dispose();
      delete listeners[type];
    }
  }

  removeAllEventListeners() {
    const edData = this.__yced;
    const listeners = edData.listeners;
    for (const k of Object.keys(listeners)) {
      listeners[k].dispose();
    }
    edData.listeners = {};
  }

  on(typeOrMap, func) {
    spread(this, this.addEventListener, typeOrMap, func);
  }

  once(typeOrMap, func) {
    spread(this, this.addOneTimeEventListener, typeOrMap, func);
  }

  off(typeOrMap, func) {
    spread(this, this.removeEventListener, typeOrMap, func);
  }

  dispatchEvent(eventOrTypeString, mixin = null) {
    const event =
      eventOrTypeString instanceof Event
        ? eventOrTypeString
        : new Event(eventOrTypeString, mixin);

    const callbackSet = getListenersForType(this, event.type);
    if (callbackSet) {
      event.target = this.__yced.target;
      callbackSet.call(event);
    }
  }

  dispose() {
    this.removeAllEventListeners();
    this.__yced = null;
  }
}
EventDispatcher.prototype.one = EventDispatcher.prototype.once;

EventDispatcher.prototype.dispatch = EventDispatcher.prototype.trigger =
  EventDispatcher.prototype.dispatchEvent;
