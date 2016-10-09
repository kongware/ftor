// HINT: map can be passed to both fold and foldk
module.exports = map = f => function* (iter) {
  for (let a of iter) {
    yield f(a);
  }
};