"use strict";


// dependencies


const {render_} = require("./render");


/**
 * @name log
 * @type impure function
 * @example
 *

   log("${0} monkeys on ${1} trees") (12, 2);

 */


// ?
const log = template => (...args) => (console.log(render_(template, ...args)), args[args.length - 1]);


// ?
const log_ = (template, ...args) => (console.log(render_(template, ...args)), args[args.length - 1]);


// API


module.exports = {log, log_};