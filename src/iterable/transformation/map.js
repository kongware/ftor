// HINT: map can be passed to both fold and foldk
module.exports = map = f => iter => function* () {
  for (let x of iter) {
    yield f(x);
  }
}();