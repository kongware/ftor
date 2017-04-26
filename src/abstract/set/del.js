"use strict";


// dependencies


const clone = require("../clone") (Set);


/**
 * @name del
 * @note del_ is a destructive operation
 * @type first order function
 * @example

   ?

 */


// k -> Set -> Set
const del = k => set => (set = clone(set), set.delete(k), set);


// k -> Set -> Set
const del_ = k => set => (set.delete(k), set);


// API


module.exports = {del, del_};