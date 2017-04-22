"use strict";


// dependencies


const {C_} = require("./C");
const {concat_} = require("./product/array/concat");
const foldr = require("./product/array/foldr");


/**
 * @name concatmap
 * @type higher order function
 * @example

   ?

 */


// Foldable t => Object -> (a -> [b]) -> t a -> [b]
const concatMap = Rep => f => Rep.foldr(C_(concat_, f)) ([]);


// API


module.exports = concatMap;