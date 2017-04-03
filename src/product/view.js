"use strict";


// dependencies


const B = require("../B");
const Const = require("../sum/const/Const");
const run = require("../sum/const/run");


/**
 * @name view through a lense
 * @type operator function
 * @example
 *

   ?

 */


// Functor f => (a -> f a) -> Object|Array -> a
const view = lens => B(run) (lens(Const));


// API


module.exports = view;