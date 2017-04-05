"use strict";


// dependencies


const mapBy = require("../../mapBy");


/**
 * @name key lens
 * @type operator function
 * @example
 *

   @see ../view

 */


// Functor f => String -> (a -> f b) -> Object -> Object
const key = k => f => o => mapBy(v => Object.assign({}, o, {[k]: v})) (f(o[k]));


// API


module.exports = key;