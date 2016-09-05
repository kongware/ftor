module.exports = foldlk = f => acc => ([head, ...tail]) => head === undefined
 ? acc
 : f(acc) (head) (acc => foldlk(f) (acc) (tail));