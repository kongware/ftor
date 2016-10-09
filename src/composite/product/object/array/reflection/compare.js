const every2 = require("../folding/every2");

module.exports = compare = f => as => bs => as.length === bs.length
 ? every2(a => b => f(a) (bs[b])) (as)
 : false;