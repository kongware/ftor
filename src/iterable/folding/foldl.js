// HINT: as long as there is no broad support of TCO we fall back on imperative loops
module.exports = foldl = f => acc => iter => {
  let i;

  while (true) {
    i = next(iter);
    if (i.done) return acc;
    else acc = f(acc)(i.value);
  }
}

/*
foldl = f => acc => iter => {
  const loop = (acc, {value:x, done}) => done
   ? acc
   : loop(f(acc) (x), next(iter));

  return loop(acc, next(iter));
};
*/