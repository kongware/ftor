"use strict";


// dependencies


const init = require("./product/array/init");
const last = require("./product/array/last");


/**
 * @name function composition pipeline
 * @type variadic higher order function
 * @example
 *

   compn(x => x * x, x => x + 1, x => x + 1) (3); // 25

 */


// ?
const compn = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// ?
const compn2 = (...fs) => x => compn(...init(fs), last(fs) (x));


// ?
const compn2_ = (...fs, x) => compn(...init(fs), last(fs) (x));


// ?
const compn3 = (...fs) => x => y => compn(...init(fs), last(fs) (x) (y));


// ?
const compn3_ = (...fs, x, y) => compn(...init(fs), last(fs) (x) (y));


// ?
const compn3__ = (...fs, x, y) => compn(...init(fs), last(fs) (x, y));


// API


module.exports = {compn, compn2, compn2_, compn3, compn3_, compn3__};