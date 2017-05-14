"use strict";


// dependencies


const render = require("../primitive/string/render");


/**
 * @name log
 * @type action
 * @status stable
 * @example

   const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
   const log = template => (...args) => (console.log(render(template) (...args)), args[args.length - 1]);

   log("invalid type: ${0}") (null); // invalid type: null

 */


// String -> [*] -> IO
const log = template => (...args) => (console.log(render(template, ...args)), args[args.length - 1]);


// API


module.exports = log;