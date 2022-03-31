const scalars = require('./scalars')

const isScalar = (type) => {
  if (
    type in scalars ||
    type === 'String' ||
    type === 'ID' ||
    type === 'Int' ||
    type === 'Boolean' ||
    type === 'Float'
  ) {
    return true
  } else {
    return false
  }
}
const isBasicType = (type) => {
  if (
    type === 'String' ||
    type === 'ID' ||
    type === 'Int' ||
    type === 'Boolean' ||
    type === 'Float'
  ) {
    return true
  } else {
    return false
  }
}

module.exports = {
  isScalar: isScalar,
  isBasicType: isBasicType,
}
