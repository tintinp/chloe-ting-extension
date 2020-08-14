const isNumber = (value) => {
  if (typeof value !== 'number') {
    return false
  }
  if (value !== Number(value)) {
    return false
  }
  return true
}

export default isNumber
