"use strict";


/**
 * @name run identity
 * @type operator function
 * @example

   run(Const(5)); // 5

 */


// Const t => t a -> a
const run = t => t.x;


// API


module.exports = run;