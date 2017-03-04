"use strict";

const typedict = {};


typedict.builtins = new WeakMap();


typedict.builtins.set(Array.prototype, {
});


typedict.builtins.set(Boolean.prototype, {
  minBound: false,
  maxBound: true
});


typedict.builtins.set(Function.prototype, {
});


typedict.builtins.set(null, {
});


typedict.builtins.set(Number.prototype, {
  minBound: -Infinity,
  maxBound: Infinity
});


typedict.builtins.set(Object.prototype, {
});


typedict.builtins.set(String.prototype, {
});


typedict.builtins.set(undefined, {
});


module.exports = typedict;