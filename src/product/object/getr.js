"use strict";


/**
 * @name get property value recursively
 * @type operator function
 * @example
 *

   const o = {name:"THX1138", friends: [{name: "LUH3417"}, {name: "SEN5241"}]}
   getr("friends", 0, "name") (o); // "LUH3417"

 */


// (String) -> Object -> a
const getr = (...ks) => o => {
  const aux = (o, [k, ...tail]) => {
    if (k === undefined) return o;
    if (k in o) return aux(o[k], tail);
    throw new TypeError("invalid property");
  }

  return aux(o, ks);
};


// (Object, String) -> a
const getr_ = (o, ...ks) => {
  const aux = (o, [k, ...tail]) => {
    if (k === undefined) return o;
    if (k in o) return aux(o[k], tail);
    throw new TypeError("invalid property");
  }

  return aux(o, ks);
};


// API


module.exports = {getr, getr_};