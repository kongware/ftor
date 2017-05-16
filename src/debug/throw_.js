"use strict";


// dependencies


const {render} = require("../primitive/str");


/**
 * @name throw
 * @type action
 * @status stable
 * @example

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);

  const throw_ = cons => template => f => x => {
    throw new cons(render(template) (f(x)));
  };

  throw_(TypeError) ("invalid type ${0}") (x => x === null ? x : typeof x) (false); // TypeError: invalid type boolean
  throw_(TypeError) ("invalid type ${0}") (x => x === null ? x : typeof x) (null); // TypeError: invalid type null

 */


// (a -> b) -> String -> [*] -> IO
const throw_ = cons => template => f => x => {
  throw new cons(render(template) (f(x)));
};


// API


module.exports = throw_;