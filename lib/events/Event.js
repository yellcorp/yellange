// improvement ideas:
//  make it prototype based
//  use WeakMap for private props
export function Event(typeString, mixin = null) {
  // call as:
  // new Event("type")
  // new Event("type", { otherProps ... });
  // new Event({ type: "type", otherProps ... });

  let type;
  let mixins = [];
  if (typeof typeString === 'string') {
    type = typeString;
  } else {
    type = String(typeString.type);
    mixins.push(typeString);
  }

  if (mixin) {
    mixins.push(mixin);
  }

  Object.assign(this, ...mixins);
  typeString = mixins = null;

  this.type = type;

  let defaultPrevented = false;
  this.preventDefault = () => {
    defaultPrevented = true;
  };

  this.isDefaultPrevented = () => defaultPrevented;

  this.toString = () => `[Event ${this.type}]`;
}
