/**
 * @file timing: Timeouts, intervals, debouncing and throttling.
 *
 * Provides a simple OO wraper around `window.setTimeout/setInterval`. Also
 * provides the usual `debounce` and `throttle` functions.
 */

function limiter(func, delay, isThrottle) {
  let timeoutId = NaN;
  let lastCall = NaN;

  function thunk() {
    timeoutId = NaN;
    lastCall = Date.now();
    func();
  }

  return function () {
    if (isFinite(timeoutId)) {
      window.clearTimeout(timeoutId);
    }
    if (isThrottle && (isNaN(lastCall) || Date.now() - lastCall > delay)) {
      thunk();
    }
    timeoutId = window.setTimeout(thunk, delay);
  };
}

export function debounce(func, delay) {
  return limiter(func, delay, false);
}

export function throttle(func, delay) {
  return limiter(func, delay, true);
}

class Interval {
  constructor(func, delay, thisArg, funcArgs) {
    this._func = func;
    this._delay = delay;
    this._thisArg = thisArg;
    this._funcArgs = funcArgs || [];

    this._id = NaN;
    this._active = false;
    this._disposed = false;

    this._boundRun = this._run.bind(this);
  }

  _run() {
    this._func.apply(this._thisArg, this._funcArgs);
  }

  get active() {
    return !this._disposed && this._active;
  }

  set active(newActive) {
    if (this._disposed) {
      return;
    }

    newActive = Boolean(newActive);
    if (newActive !== this._active) {
      this._active = newActive;
      if (newActive) {
        this._id = window.setInterval(this._boundRun, this._delay);
      } else {
        window.clearInterval(this._id);
        this._id = NaN;
      }
    }
  }

  setActive(newActive) {
    // a method form of the .active setter for chaining to the constructor
    this.active = newActive;
    return this;
  }

  dispose() {
    this.active = false;
    this._disposed = true;

    this._func = this._thisArg = this._funcArgs = null;
  }
}

export function interval(func, delay, thisArg, funcArgs) {
  return new Interval(func, delay, thisArg, funcArgs);
}

class Timeout {
  constructor(func, delay, thisArg, funcArgs) {
    this._func = func;
    this._delay = delay;
    this._thisArg = thisArg;
    this._funcArgs = funcArgs || [];

    this._waiting = true;
    this._id = window.setTimeout(
      this._run.bind(this, false, true),
      this._delay
    );
  }

  _run(clear, invoke) {
    this._waiting = false;
    if (clear) {
      window.clearTimeout(this._id);
    }
    this._id = NaN;
    if (invoke) {
      this._func.apply(this._thisArg, this._funcArgs);
    }

    this._func = this._thisArg = this._funcArgs = null;
  }

  _runIfWaiting(clear, invoke) {
    if (this._waiting) {
      this._run(clear, invoke);
      return true;
    }
    return false;
  }

  get waiting() {
    return this._waiting;
  }

  invokeNow() {
    return this._runIfWaiting(true, true);
  }

  cancel() {
    return this._runIfWaiting(true, false);
  }

  dispose() {
    this.cancel();
  }
}

export function timeout(func, delay, thisArg, funcArgs) {
  return new Timeout(func, delay, thisArg, funcArgs);
}
