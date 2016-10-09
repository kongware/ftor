// HINT: filter can be passed to both fold and foldk
module.exports = filter = pred => function* (iter) {
  for (let a of iter) {
    if (pred(a)) yield a;
  }
};