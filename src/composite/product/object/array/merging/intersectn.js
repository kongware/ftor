const foldl = require("../folding/foldl");
const _intersect = require("./_intersect");

module.exports = intersectn = (head, ...tail) => foldl(_intersect) (head) (tail);