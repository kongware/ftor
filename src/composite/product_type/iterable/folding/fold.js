const next = require("../protocol/next");

// HINT: as long as there is no broad support of TCO we fall back on imperative loops
module.exports = foldl = f => acc => itor => {
  for (let x of itor) {
    acc = f(acc) (x);
  }

  return acc;
};

/*
foldl = f => acc => itor => {
  const loop = (acc, {value:x, done}) => done
   ? acc
   : loop(f(acc) (x), next(itor));

  return loop(acc, next(itor));
};
*/