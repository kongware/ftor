"use strict";


/**
 * @name short circuit
 * @type short circuiting operator function
 * @example
 *

   const eq_ = (x, y) => x === y;
   const neq_ = (x, y) => x !== y;
   const I = x => x;
   const otherwise = I;

   const maybeEmpty = ({length: len}) => shortc_(I, "empty array") (eq_(len, 0));
   const maybeNestedSingle = ({length: len, "0": x}) => shortc_(I, "nested single item array") (eq_(len, 1) && neq_(x[0], undefined));
   const maybeFlatSingle = ({length: len}) => shortc_(I, "flat single item array") (eq_(len, 1));
   const maybeNestedMultiple = ([x]) => shortc_(I, "nested multiple item array") (neq_(x[0], undefined));
   const flatMultiple = "flat multiple item array";

   const xs = [[1], [2], [3]];

   maybeEmpty(xs)
    || maybeNestedSingle(xs)
    || maybeFlatSingle(xs)
    || maybeNestedMultiple(xs)
    || otherwise(flatMultiple); // "nested multiple item array"

 */


// (a -> b) -> a -> Boolean -> c|Boolean
const shortc = f => y => x => x === true && f(y);


// ((a -> b), a) -> Boolean -> c|Boolean
const shortc_ = (f, y) => x => x === true && f(y);


// API


module.exports = {shortc, shortc_};