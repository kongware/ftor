const freeze = require("../object/construction/freeze");

module.exports = tuple = (...xs) => freeze(xs);