"use strict";


// dependencies


const {B_} = require("./B");
const {concat_} = require("./product/array/concat");
const foldr = require("./product/array/foldr");


/**
 * @name foldmap
 * @type higher order function
 * @example

   ?

 */


// (Foldable t, Monoid m) => (Object, Object) -> (a -> m) -> t a -> m
const foldMap = (Rep1, Rep2) => f => Rep1.foldr(B_(Rep2.concat_, f)) (Rep2.empty);


// API


module.exports = foldMap;