"use strict";


/**
 * @name compare by
 * @type higher order function
 * @status stable
 * @example

  const compareBy = f => ix => iy => {
    const {value: x} = ix.next(), {value: y} = iy.next();

    if (x === undefined && y === undefined) return true;
    else if (!f(x) (y)) return false;
    else return compareBy(f) (ix) (iy);
  };

  const itor = iter => iter[Symbol.iterator]();
  const eq = x => y => x === y;
  const looseEq = x => y => x == y;

  const xs = [1, 2, 3], ys = ["1" , "2", "3"];

  compareBy(eq) (itor(xs)) (itor(ys)); // false
  compareBy(looseEq) (itor(xs)) (itor(ys)); // true

 */


// (a -> b -> Boolean) -> a -> b -> Boolean
const compareBy = f => ix => iy => {
  const {value: x} = ix.next(), {value: y} = iy.next();

  if (x === undefined && y === undefined) return true;
  else if (!f(x) (y)) return false;
  else return compareBy(f) (ix) (iy);
};


// API


module.exports = compareBy;