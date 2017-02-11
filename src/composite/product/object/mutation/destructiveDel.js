// rev1
module.exports = destructiveDel = k => o => (delete o[k], o);