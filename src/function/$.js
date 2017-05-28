"use strict";


/**
 * @name $
 * @note call with infix notation or with left/right section
 * @type higher order function
 * @status stable
 * @example

  const $ = (x, f, y) => f(x) (y);
  const $_ = (x, f) => f(x);
  const _$ = (f, y) => x => f(x) (y);

  const sub = x => y => x - y;
  
  $(2, sub, 3); // -1
  $_(2, sub) (3); // -1
  _$(sub, 3) (2); // -1

 */


// (a -> (a -> b -> c) -> b) -> c
const $ = (x, f, y) => f(x) (y);


// (a -> (a -> b -> c)) -> b -> c
const $_ = (x, f) => f(x);


// ((a -> b -> c) -> b) -> a -> c
const _$ = (f, y) => x => f(x) (y);


// API


module.exports = {$, $_, _$};