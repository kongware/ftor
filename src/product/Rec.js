"use strict";


// dependencies


const {$Rec} = require("../interop");


// CONSTRUCTOR


/**
 * @name Record
 * @note combined constructor/namespace
 * @type product type
 * @status stable
 */


const handler = {
  get: (o, k) => {
    if (k in o && o[k]) return o[k];
    throw new TypeError("invalid property");
  },

  set:
};


// (...(String, *)) -> {String: *}
const Rec = (...pairs) => {
  const o = pairs.reduce((o, pair) => (o[pair[0]] = pair[1], o), new Proxy({}, handler));
  Object.seal(o);
  o[$Rec] = true;
  return o;
};


// SPECIFIC


// API


module.exports = Rec;