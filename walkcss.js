/**
 * @file walkcss: Traverse a document's style sheets.
 */
import { isArrayLike } from './lang';
import { extend } from './array';

function makeControlCallback(func) {
  let keepGoing = true;

  function stop() {
    keepGoing = false;
  }

  return (arg) => {
    func(arg, stop);
    return keepGoing;
  };
}

/**
 * Callback for `CSSRule`s discovered by {@link walkcss}.
 *
 * @callback cssRuleCallback
 * @param {CSSRule} rule - A discovered CSS rule
 * @param {function} breaker - A function which can be called to immediately
 *   halt the iteration.
 */

/**
 * Callback for errors thrown during {@link walkcss}.
 *
 * @callback cssTraverseErrorCallback
 * @param {Error} error - The error caught.
 * @param {*} object - The object that was being queried at the time of the
 *   error.
 */

/**
 * Traverse CSS rules, passing each one to a callback.
 *
 * The following objects are traversed:
 * - `HTMLDocument` - its `.styleSheets` property is searched.
 * - Arrays or array-like objects
 * - `StyleSheetList`
 * - `CSSStyleSheet`
 * - `CSSRuleList`
 * - `CSSRule` if its `.type` is:
 *   - `MEDIA_RULE` or `SUPPORTS_RULE` - `.cssRules` is searched.
 *   - `IMPORT_RULE` - `.styleSheet` is searched.
 *
 * Each discovered instance of `CSSRule` is passed to the callback.
 *
 * An optional error callback can be provided to handle errors if they occur.
 * When an error callback is provided, the default behavior is to ignore an
 * error - to propagate it, the error callback must rethrow it.
 *
 * @param {*} root - The root object at which to begin traversal.
 * @param {cssRuleCallback} callback - The callback to be invoked with each
 *   discovered `CSSRule`.
 * @param {cssTraverseErrorCallback} [errorCallback] - Optional error handler
 *   which will be invoked with any errors that occur during traversal.
 */
export function walkcss(root, callback, errorCallback = null) {
  const caller = makeControlCallback(callback);

  const q = [root];

  while (q.length > 0) {
    const currentObj = q.shift();

    try {
      if (currentObj.styleSheets) {
        // HTMLDocument
        q.push(currentObj.styleSheets);
      } else if (currentObj.cssRules) {
        // CSSStyleSheet, CSSRule.MEDIA_RULE, CSSRule.SUPPORTS_RULE
        if (currentObj instanceof CSSRule) {
          if (!caller(currentObj)) {
            return;
          }
        }
        q.push(currentObj.cssRules);
      } else if (
        currentObj instanceof StyleSheetList ||
        currentObj instanceof CSSRuleList ||
        isArrayLike(currentObj)
      ) {
        extend(q, currentObj);
      } else if (currentObj instanceof CSSRule) {
        if (!caller(currentObj)) {
          return;
        }

        if (currentObj.type === CSSRule.IMPORT_RULE) {
          q.push(currentObj.styleSheet);
        }
      }
    } catch (error) {
      if (errorCallback) {
        errorCallback(error, currentObj);
      }
    }
  }
}
