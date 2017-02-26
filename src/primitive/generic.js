"use strict";

const generic = {};


generic.eq_ = (x, y) => Object.is(x, y);


generic.eq = y => x => Object.is(x, y);


generic.gt_ = (x, y) => x > y;


generic.gt = y => x => x > y;


generic.gte_ = (x, y) => x >= y;


generic.gte = y => x => x >= y;


generic.lt_ = (x, y) => x < y;


generic.lt = y => x => x < y;


generic.lte_ = (x, y) => x <= y;


generic.lte = y => x => x <= y;


generic.max_ = (x, y) => x > y ? x : y;


generic.max = y => x => x > y ? x : y;


generic.min_ = (x, y) => x < y ? x : y;


generic.min = y => x => x < y ? x : y;


generic.neq_ = (x, y) => !Object.is(x, y);


generic.neq = y => x => !Object.is(x, y);


module.exports = generic;