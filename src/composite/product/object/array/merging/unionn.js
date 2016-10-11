const foldl = require("../folding/foldl");
const _union = require("./_union");

module.exports = unionn = (head, ...tail) => foldl(_union) (head) (tail);