"use strict";


// dependencies


const {B_} = require("./B");


/**
 * @name fold map
 * @note generic concat map
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (Foldable t, Monoid m) => (a -> m) -> t a -> m
const foldMap = (fold, append, empty) => f => fold(B_(append, f)) (empty);


// API


module.exports = foldMap;