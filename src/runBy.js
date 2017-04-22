"use strict";


/**
 * @name run by context
 * @type operator function
 * @example

   ?

 */


// Object -> a
const runBy = t => "run" in t ? t.run(t) : t.x;


// API


module.exports = runBy;