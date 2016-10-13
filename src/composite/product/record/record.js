const assign = require("../object/construction/assign");
const freeze = require("../object/construction/freeze");

module.exports = record = (...xs) => freeze(assign({}, ...xs));