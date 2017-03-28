"use strict";

const {init, last} = require("./product/array");

const {LT, EQ, GT} = require("./sum/Ordering");

const generic = {};


generic.repeat = n => f => x => {
  const next = (x, n) => n > 0 ? next(f(x), n - 1) : x;
  return next(x, n);
};


generic.repeatWhile = n => pred => f => x => {
  const next = (x, n, prev) => pred(n, x) ? next(f(x), n - 1, x) : prev;
  return next(x, n, x);
};


generic.sequence = f => (x, y) => {
  const aux = (acc, z) => z <= y
   ? aux(acc.concat(z), f(z))
   : acc;

  return aux([], x);
};


generic._sequence = f => (x, y) => {
  function* aux() {
    while (true) {
      yield x;
      x = f(x);
      if (x > y) break;
    }
  }

  return aux();
};


generic.strict = f => g => f(g());


generic.strict2 = f => x => g => f(x) (g());


generic.strict3 = f => x => y => g => f(x) (y) (g());


generic.strict4 = f => x => y => z => g => f(x) (y) (z) (g());


generic.strict5 = f => w => x => y => z => g => f(w) (x) (y) (z) (g());


generic.swap = f => (x, y) => f(y, x);


generic.T = x => f => f(x);


generic.T2 = x => y => f => f(x) (y);


generic.T3 = x => y => z => f => f(x) (y) (z);


generic.T4 = w => x => y => z => f => f(w) (x) (y) (z);


generic.T5 = v => w => x => y => z => f => f(v) (w) (x) (y) (z);


generic.tap = f => x => (f(x), x);


generic.tap0 = f => x => (f(), x);


generic.tap2 = f => x => y => (f(x) (y), y);


generic.tap3 = f => x => y => z => (f(x) (y) (z), z);


generic.tap4 = f => w => x => y => z => (f(w) (x) (y) (z), z);


generic.tap5 = f => v => w => x => y => z => (f(v) (w) (x) (y) (z), z);


generic.times = n => f => repeat (n) (x => (f(x), x + 1)) (0);


generic.trace = tag => generic.tap(generic.partial(log) (tag));


generic.trace2 = tag => generic.tap2(generic.partial(log) (tag));


generic.trace3 = tag => generic.tap3(generic.partial(log) (tag));


generic.trace4 = tag => generic.tap4(generic.partial(log) (tag));


generic.trace5 = tag => generic.tap5(generic.partial(log) (tag));


generic.U = f => f(f);


generic.xor = _default => y => x => !x === !y ? _default : x || y;


generic.xor_ = (x, y, _default) => !x === !y ? _default : x || y;


module.exports = generic;