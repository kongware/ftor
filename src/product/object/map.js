"use strict";


/**
 * @name map over a property
 * @type first order function
 * @example
 *

   const o = {name: "European Union", cc: "eu"};
   const p = map(x => x.toUpperCase()) ("cc") (o); // {name: "European Union", cc: "EU"};
   console.assert(o !== p); // passes

 */


// (a -> b) -> String -> Object -> Object
const map = f => k => o => Object.assign({}, o, {[k]: f(o[k])});


// API


module.exports = map;