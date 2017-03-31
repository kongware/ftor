"use strict";


/**
 * @name run identity
 * @type operator function
 * @example

   run(Ident(5)); // 5

 */


// Ident t => t a -> a
const run = t => t.x;


// API


module.exports = run;