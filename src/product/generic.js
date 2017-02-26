"use strict";

const generic = {};


generic.filterer = pred => rf => acc => x => pred(x) ? rf(acc) (x) : acc;


generic.mapper = tf => rf => acc => x => rf(acc) (tf(x));


generic.next = itor => itor.next();


module.exports = generic;