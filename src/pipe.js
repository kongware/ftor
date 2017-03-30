"use strict";


// dependencies


const init = require("./product/array/init");
const last = require("./product/array/last");


/**
 * @name function composition pipeline
 * @type variadic higher order function
 * @example
 *

   pipe(x => x * x, x => x + 1, x => x + 1) (3); // 25

 */


// ?
const pipe = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


// ?
const pipe2 = (...fs) => x => pipe(...init(fs), last(fs) (x));


// ?
const pipe2_ = (...fs, x) => pipe(...init(fs), last(fs) (x));


// ?
const pipe3 = (...fs) => x => y => pipe(...init(fs), last(fs) (x) (y));


// ?
const pipe3_ = (...fs, x, y) => pipe(...init(fs), last(fs) (x) (y));


// ?
const pipe3__ = (...fs, x, y) => pipe(...init(fs), last(fs) (x, y));


// API


module.exports = {pipe, pipe2, pipe2_, pipe3, pipe3_, pipe3__};