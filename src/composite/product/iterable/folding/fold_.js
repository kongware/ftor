module.exports = fold_ = f => init => function* (iter) {
  let acc = init;
  for (a of iter) {
    acc = f(acc) (a);
    yield acc;
  }
};