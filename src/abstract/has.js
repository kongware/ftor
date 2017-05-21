"use strict";


/**
 * @name has
 * @type first order function
 * @status stable
 * @example

  const has = x => tx => tx.has(x);
  const m = new Map([[1, true]]);
  const wm = new WeakMap([[m, true]]);
  const s = new Set([1]);
  const ws = new WeakSet([s]);

  has(1) (m); // true
  has(m) (wm); // true
  has(1) (s); // true
  has(s) (ws); // true

 */


// a -> Abstract a -> Boolean
const has = x => tx => tx.has(x);

// API


module.exports = create;