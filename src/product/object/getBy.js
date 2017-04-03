"use strict";


/**
 * @name get nested property value by functions recursively
 * @type higher order function
 * @example
 *

   const o = {name: "THX1138", friends: [{name: "LUH3417"}, {name: "SEN5241"}]}
   getBy(K("friends"), xs => xs.length - 1, K("name")) (o); // "SEN5241"

 */


// (Object|Array -> String) -> Object -> a
const getBy = (...fs) => o => {
  const aux = (o, k, [f, ...tail]) => {
    if (f === undefined) return o;
    k = f(o);
    if (k in o) return aux(o[k], tail);
    throw new TypeError("invalid property");
  };

  return aux(o, "", fs);
};


// (Object, ((Object|Array -> String))) -> a
const getBy_ = (o, ...fs) => {
  const aux = (o, k, [f, ...tail]) => {
    if (f === undefined) return o;
    k = f(o);
    if (k in o) return aux(o[k], tail);
    throw new TypeError("invalid property");
  };

  return aux(o, "", fs);
};


// API


module.exports = {getBy, getBy_};