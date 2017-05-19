"use strict";


/**
 * @name compare by
 * @type higher order function
 * @status stable
 * @example

  const compareBy = pred => ix => iy => {
    const aux = (ix, iy) => {
      const {value: x} = ix.next(), {value: y} = iy.next();

      if (x === undefined && y === undefined) return true;
      else if (!pred(x) (y)) return false;
      else return aux(ix, iy);
    };

    return aux(ix[Symbol.iterator](), iy[Symbol.iterator]())
  };

  const itor = iter => iter[Symbol.iterator]();
  const eq = x => y => x === y;
  const looseEq = x => y => x == y;

  const xs = [1, 2, 3], ys = ["1" , "2", "3"];

  compareBy(eq) (itor(xs)) (itor(ys)); // false
  compareBy(looseEq) (itor(xs)) (itor(ys)); // true

 */


// (a -> a -> Boolean) -> Iterable a -> Iterable a -> Boolean
const compareBy = pred => ix => iy => {
  const aux = (ix, iy) => {
    const {value: x} = ix.next(), {value: y} = iy.next();

    if (x === undefined && y === undefined) return true;
    else if (!pred(x) (y)) return false;
    else return aux(ix, iy);
  };

  return aux(ix[Symbol.iterator](), iy[Symbol.iterator]())
};


// API


module.exports = compareBy;