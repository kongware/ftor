"use strict";
"use strict";

module.exports = o => o.constructor ? o.constructor.prototype : Object.getPrototypeOf(o);