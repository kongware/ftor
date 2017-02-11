"use strict";

module.exports = o => Object.entries(o).reduce((acc, x) => acc.concat([[x[0], x[1]]]), []);