"use strict";

const num = {};


num.add_ = (x, y) => +x + +y;


num.add = y => x => +x + +y;


num.ceil = Math.ceil;


num.dec = x => x - 1;


num.div_ = (x, y) => x / y;


num.div = y => x => x / y;


num.even = x => x % 2 === 0;


num.floor = Math.floor;


num.inc = x => x + 1;


num.mod_ = (x, y) => x % y;


num.mod = y => x => x % y;


num.mul_ = (x, y) => x * y;


num.mul = y => x => x * y;


num.neg = x => -x;


num.odd = x => x % 2 === 1;


num.sub_ = (x, y) => x - y;


num.sub = y => x => x - y;


num.toBinary = x => x > 0 ? 1 : x < 0 ? -1 : 0;


module.exports = num;