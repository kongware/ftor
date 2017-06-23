"use strict";


// dependencies


const throw_ = require("./throw_");


/**
 * @name throw type error
 * @type action
 * @status stable
 * @example

  @see throw_

 */


// (String -> IO String) -> String -> IO String
const throwType = throw_(TypeError);


// API


module.exports = throwType;