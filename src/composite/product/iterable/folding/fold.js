const next = require("../protocol/next");

// HINT: as long as there is no broad support of TCO we fall back on imperative loops
module.exports = foldl = f => acc => itor => {
  for (let a of itor) {
    acc = f(acc) (a);
  }

  return acc;
};

/*
foldl = f => acc => itor => {
  const loop = (acc, {value:a, done}) => done
   ? acc
   : loop(f(acc) (a), next(itor));

  return loop(acc, next(itor));
};
*/