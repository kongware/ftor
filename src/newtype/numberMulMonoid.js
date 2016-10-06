module.exports = numberMulMonoid = {
  concat: y => x => x * y,
  empty: () => 1
};