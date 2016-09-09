const uncurry = require("../../../polymorphic/currying/uncurry");

module.exports = foldl = f => acc => iter => {
  let i;

  while (true) {
    i = next(iter);
    if (i.done) return acc;
    else acc = f(acc)(i.value);
  }
}

foldl = f => acc => iter => {
  let {value, done} = next(iter);
  return done ? acc : foldl(f) (f(acc) (value)) (iter)
}