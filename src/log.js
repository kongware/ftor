"use strict";


// dependencies


const render = require("./render");


/**
 * @name log
 * @type impure function
 * @example

   ?

 */


// String -> (*) -> String
const log = template => (...args) => (console.log(render(template, ...args)), args[args.length - 1]);


// API


module.exports = log;