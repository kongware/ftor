"use strict";


/**
 * @name render
 * @type variadic operator function
 * @example
 *

   render("${0} developers, ${1} options") (2, 3); // 2 developers, 3 options

 */


// String -> (*) -> String
const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


// (String, (*)) -> String
const render_ = (template, ...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);


// API


module.exports = {render, render_};