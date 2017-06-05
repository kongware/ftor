"use strict";


// dependencies


const {render} = require("./primitive/str");


/**
 * @name throw with function
 * @type action
 * @status stable
 * @example

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);

  const throwf = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  throwf(TypeError) ("invalid type ${0}") (x => x === null ? x : typeof x) (false); // TypeError: invalid type boolean
  throwf(TypeError) ("invalid type ${0}") (x => x === null ? x : typeof x) (null); // TypeError: invalid type null

 */


// (b -> Error) -> String -> (a -> b) -> IO
const throwf = cons => template => f => x => {
  throw new cons(render(template) (f(x)));
};


// API


module.exports = throwf;