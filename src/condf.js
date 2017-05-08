"use strict";


/**
 * @name conditional function
 * @note lazy conditional expression
 * @type higher order function
 * @status stable
 * @example

   ?

 */


// (a -> b) -> Boolean -> a -> b
const condf = f => x => p => p ? f(x) : x;


// Boolean -> (a -> b) -> a -> b
const condf_ = p => f => x => p ? f(x) : x;


// (a -> b -> c) -> Boolean -> a -> b -> c
const condf2 = f => x => y => p => p ? f(x) (y): y;


// Boolean -> (a -> b -> c) -> a -> b -> c
const condf2_ = p => f => x => y => p ? f(x) (y): y;


// (a -> b -> c -> d) -> Boolean -> a -> b -> c -> d
const condf3 = f => x => y => z => p => p ? f(x) (y) (z): z;


// Boolean -> (a -> b -> c -> d) -> a -> b -> c -> d
const condf3_ = p => f => x => y => z => p ? f(x) (y) (z): y;


module.exports = {condf, condf_, condf2, condf2_, condf3, condf3_};