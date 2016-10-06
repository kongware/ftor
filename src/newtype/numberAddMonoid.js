module.exports = numberAddMonoid = {
  concat: y => x => +x + +y,
  empty: () => 0
};