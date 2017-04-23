"use strict";


// dependencies


const clone = require("../clone") (WeakSet);


/**
 * @name del
 * @note del_ is a destructive operation
 * @type operator function
 * @example

   ?

 */


// k -> WeakSet -> WeakSet
const del = k => weakSet => (weakSet = clone(weakSet), weakSet.delete(k), weakSet);


// k -> WeakSet -> WeakSet
const del_ = k => weakSet => (weakSet.delete(k), weakSet);


// API


module.exports = {del, del_};