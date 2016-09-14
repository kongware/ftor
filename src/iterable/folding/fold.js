const next = require("../protocol/next");

// HINT: as long as there is no broad support of TCO we fall back on imperative loops
module.exports = foldl = f => acc => itor => {
  let i;

  while (true) {
    i = next(itor);
    if (i.done) return acc;
    else acc = f(acc)(i.value);
  }
}

/*
foldl = f => acc => itor => {
  const loop = (acc, {value:x, done}) => done
   ? acc
   : loop(f(acc) (x), next(itor));

  return loop(acc, next(itor));
};
*/