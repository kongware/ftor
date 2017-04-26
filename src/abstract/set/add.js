"use strict";


// dependencies


const clone = require("../clone") (Set);


/**
 * @name add
 * @note add_ is a destructive operation
 * @type first order function
 * @example

   ?

 */


// k -> Set -> Set
const add = k => set => clone(set).add(k);


// k -> Set -> Set
const add_ = k => set => set.add(k);


// API


module.exports = {add, add_};