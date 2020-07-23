require('regenerator-runtime/runtime')

const wait = async (time) => new Promise((resolve) => setTimeout(resolve, time))

export default wait
