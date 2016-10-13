// HINT: filter can be passed to both fold and foldk
module.exports = filter = pred => function* (iter) {
  for (let x of iter) {
    if (pred(x)) yield x;
  }
};