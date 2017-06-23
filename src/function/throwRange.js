"use strict";


// dependencies


const throw_ = require("./throw_");


/**
 * @name throw range error
 * @type action
 * @status stable
 * @example

  @see throw_

 */


// (String -> IO String) -> String -> IO String
const throwRange = throw_(RangeError);


// API


module.exports = throwRange;