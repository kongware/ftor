"use strict";

const {init, last} = require("./produce/array");

const {not} = require("./primitive/bool");

const generic = {};


generic.A = f => x => f(x);


generic.A2 = f => x => y => f(x) (y);


generic.A3 = f => x => y => z => f(x) (y) (z);


generic.A4 = f => w => x => y => z => f(w) (x) (y) (z);


generic.A5 = f => v => w => x => y => z => f(v) (w) (x) (y) (z);


generic.ap = f => g => x => f(x) (g(x));


generic.and_ = (x, y) => x && y;


generic.and = y => x => x && y;


generic.comp = f => g => x => f(g(x));


generic.comp2 = f => g => x => y => f(g(x) (y));


generic.comp3 = f => g => x => y => z => f(g(x) (y) (z));


generic.comp4 = f => g => w => x => y => z => f(g(w) (x) (y) (z));


generic.comp5 = f => g => v => w => x => y => z => f(g(v) (w) (x) (y) (z));


generic.compn = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);


generic.compn2 = (...fs) => x => generic.compn(...init(fs), last(fs) (x));


generic.compn3 = (...fs) => x => y => generic.compn(...init(fs), last(fs) (x) (y));


generic.compn4 = (...fs) => x => y => z => generic.compn(...init(fs), last(fs) (x) (y) (z));


generic.compn5 = (...fs) => w => x => y => z => generic.compn(...init(fs), last(fs) (w) (x) (y) (z));


generic.compare_ = (x, y) => x < y ? -1 : y < x ? 1 : 0;


generic.compare = y => x => x < y ? -1 : y < x ? 1 : 0;


generic.compareBy = f => x => y => f(x) (y) ? -1 : f(y) (x) ? 1 : 0;


generic.composable_ = (f, ...args) => x => f(...args, x);


generic.composable = f => (...args) => x => f(...args, x);


generic.evaluate = x => typeof x === "function" ? x() : x;


geneirc.flip = f => y => x => f(x) (y);


generic.guard = f => pred => x => pred(x) ? f(x) : x;


generic.guard2 = f => pred => x => y => pred(y) ? f(x) (y) : y;


generic.guard3 = f => pred => x => y => z => pred(z) ? f(x) (y) (z) : z;


generic.guard4 = f => pred => w => x => y => z => pred(z) ? f(w) (x) (y) (z) : z;


generic.guard5 = f => pred => v => w => x => y => z => pred(z) ? f(v) (w) (x) (y) (z) : z;


generic.I = x => x;


generic.isAssigned = x => x !== undefined && x !== null;


generic.K = x => _ => x;


generic.lazy2 = f => x => () => f(x);


generic.lazy3 = f => x => y => () => f(x) (y);


generic.lazy4 = f => x => y => z => () => f(x) (y) (z);


generic.lazy5 = f => w => x => y => z => () => f(w) (x) (y) (z);


generic.lift = f => g => h => x => f(g(x)) (h(x));


generic.localeCompare_ = (x, y) => x.localeCompare(y);


generic.localeCompare = y => x => x.localeCompare(y);


generic.log_ = (...args) => console.log(...args);


generic.log = (...args) => x => console.log(x, ...args);


generic.lookup = map => o => map.get(constructor in o ? o.constructor.prototype : Reflect.getPrototypeOf(o));


generic.notf = generic.comp(not);


generic.notf2 = generic.comp2(not);


generic.notf3 = generic.comp3(not);


generic.notf4 = generic.comp4(not);


generic.notf5 = generic.comp5(not);


generic.on = f => g => x => y => f(g(x)) (g(y));


generic.or_ = (x, y) => x || y;


generic.or = y => x => x || y;


generic.partial_ = (f, ...args) => (...args2) => f(...args, ...args2);


generic.partial = f => (...args) => (...args2) => f(...args, ...args2);


generic.raise_ = (x, ctor) => { throw new ctor(x) };


generic.raise = ctor => x => { throw new ctor(x) };


generic.repeat = n => f => x => {
  const next = (x, n) => n > 0 ? next(f(x), n - 1) : x;
  return next(x, n);
};


generic.repeatWhile = n => pred => f => x => {
  const next = (x, n, prev) => pred(n, x) ? next(f(x), n - 1, x) : prev;
  return next(x, n, x);
};


generic.sequence = f => (x, y) => {
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


generic.xor_ = (x, y, default) => !x === !y ? default : x || y;


generic.xor = default => y => x => !x === !y ? default : x || y;


module.exports = generic;