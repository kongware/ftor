"use strict";


// dependencies


const {render} = require("./primitive/str");


/**
 * @name throw
 * @type action
 * @status stable
 * @example

  const render = template => (...args) => template.replace(/\$\{(\d+)}/g, (_, i) => args[i]);

  const throw_ = cons => template => x => {
    throw new cons(render(template) (x));
  };

  throw_(RangeError) ("invalid value ${0}") (false); // TypeError: invalid value false
  throw_(RangeError) ("invalid value ${0}") (null); // TypeError: invalid value null

 */


// (b -> Error) -> String -> (a -> b) -> IO
const throw_ = cons => template => x => {
  throw new cons(render(template) (x));
};


// API


module.exports = throw_;