"use strict";


// dependencies


const {B_} = require("./B");
const {concat_} = require("./product/array/concat");
const foldr = require("./product/array/foldr");


/**
 * @name concatmap
 * @type higher order function
 * @example

   ?

 */


// Foldable t => Object -> (a -> [b]) -> t a -> [b]
const concatMap = Rep => f => Rep.foldr(B_(concat_, f)) ([]);


// API


module.exports = concatMap;