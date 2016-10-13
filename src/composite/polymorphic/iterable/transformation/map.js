// HINT: map can be passed to both fold and foldk
module.exports = map = f => function* (iter) {
  for (let x of iter) {
    yield f(x);
  }
};