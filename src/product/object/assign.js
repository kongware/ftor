"use strict";


/**
 * @name assign
 * @type operator function
 * @example
 *

   assign({x: 1}, {y: 2}); // {x: 1, y: 2}

 */


// [Object] -> Object
const assign = (...os) => Object.assign({}, ...os);


// API


module.exports = assign;