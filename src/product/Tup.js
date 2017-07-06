"use strict";


// DEPENDENCIES


const {lenOf} = require("../Type");
const {throwIfNot} = require("../proto/Err");


/**
 * @name Tuple
 * @note combined namespace/constructor
 * @type polymorphic function
 * @rev 0
 */


// (...? -> ?) -> [?] -> (?)
const Tup = (...cs) => {
  const Tup = xs => {
    throwIfNot(lenOf(cs.length) (xs)) (_ => `${type} expects ${cs.length} field(s) (${xs.length} field(s) received)`);

    xs.forEach((x, i) => {
      throwIfNot(cs[i] (x), x => `${type} expects ${cs[i]} at ${i + 1} (${Err.get$(x).join("/")} received)`);
    });

    xs.cs = cs;
    xs.type = type;
    return Object.freeze(xs);
  };

  const type = "(" + cs.reduce((acc, c) => `${acc}${c},`, "").slice(0, -1) + ")";
  return Tup.toString = () => type, Tup;
};


// API


module.exports = Tup;