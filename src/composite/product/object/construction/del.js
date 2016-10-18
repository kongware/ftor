const clone = require("./clone");

module.exports = delete = k => o => (o = clone(o), delete o[k], o);