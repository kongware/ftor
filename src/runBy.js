"use strict";


/**
 * @name run by
 * @type first order function
 * @status stable
 * @example

   ?

 */


// Object -> t a -> a
const runBy = Rep => t => Rep.run(t);


// API


module.exports = runBy;