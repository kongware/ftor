"use strict";


/**
 * @name conditional function application
 * @note lazy conditional expression
 * @type higher order function
 * @status stable
 * @example

  ??

 */


// (a -> b) -> Boolean -> a -> b
const condf = f => x => b => b ? f(x) : x;


// Boolean -> (a -> b) -> a -> b
const condf_ = b => f => x => b ? f(x) : x;


// (a -> b -> c) -> Boolean -> a -> b -> c
const condf2 = f => x => y => b => b ? f(x) (y): y;


// Boolean -> (a -> b -> c) -> a -> b -> c
const condf2_ = b => f => x => y => b ? f(x) (y): y;


// (a -> b -> c -> d) -> Boolean -> a -> b -> c -> d
const condf3 = f => x => y => z => b => b ? f(x) (y) (z): z;


// Boolean -> (a -> b -> c -> d) -> a -> b -> c -> d
const condf3_ = b => f => x => y => z => b ? f(x) (y) (z): y;


module.exports = {condf, condf_, condf2, condf2_, condf3, condf3_};