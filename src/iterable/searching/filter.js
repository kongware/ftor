// HINT: filter can be passed to both fold and foldk
module.exports = filter = pred => iter => function* () {
  for (let x of iter) {
    if (pred(x)) yield x;
  }
}();