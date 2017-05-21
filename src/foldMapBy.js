"use strict";


// dependencies


const {B_} = require("./B");


/**
 * @name fold map by
 * @note generic concat map
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (Foldable t, Monoid m) => (a -> m) -> t a -> m
const foldMapBy = (fold, append, empty) => f => fold(B_(append, f)) (empty);


// API


module.exports = foldMapBy;