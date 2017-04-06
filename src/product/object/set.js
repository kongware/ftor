"use strict";


/**
 * @name set a property
 * @type operator function
 * @example
 *

   const o = {x: 1}
   const p = set("y") (2); // {x: 1, y: 2}
   console.assert(o !== p); // passes

 */


// String -> a -> Object -> Object
const set = k => v => o => Object.assign({}, o, {[k]: v});


// API


module.exports = set;