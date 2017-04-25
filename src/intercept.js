"use strict";


/**
 * @name intercept
 * @type impure higher order function
 * @example

   ?

 */


// ?
const intercept = tag => f => x => (console.log("λ", tag, "(", x, ")"), x = f(x), console.log("=>", x), x);


// ?
const intercept2 = tag => f => x => y => (console.log("λ", tag, "(", x, ") (", y, ")"), x = f(x) (y), console.log("=>", x), x);


// ?
const intercept3 = tag => f => x => y => z => (console.log("λ", tag, "(", x, ") (", y, ") (", z, ")"), x = f(x) (y) (z), console.log("=>", x), x);


// API


module.exports = {intercept, intercept2, intercept3};