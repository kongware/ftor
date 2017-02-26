"use strict";

const {get} = require("./object");

const record = {};


record.cons = o => f => f(o);


record.del = k => rec => f => (delete rec[k], f(rec));


record.get = get;


record.set = (k, v) => rec => f => (rec[k] = v, f(rec));


module.exports = record;