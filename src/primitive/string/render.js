"use strict";


/**
 * @name render
 * @note variadic
 * @type first order function
 * @status stable
 * @example

   const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);
   const renderTemplate = render("${0} monkeys on ${1} trees");

   renderTemplate(9, 3); // "9 monkeys on 3 trees"

 */


// String -> [*] -> String
const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


// API


module.exports = render;