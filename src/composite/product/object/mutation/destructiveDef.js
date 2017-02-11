// rev1
module.exports = destructiveDef = (prop, dtor) => o => Object.defineProperty(o, prop, dtor);