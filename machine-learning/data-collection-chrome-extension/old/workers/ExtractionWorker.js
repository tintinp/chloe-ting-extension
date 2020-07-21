import actions from '../actions.js'

self.onmessage = (event) => {
  console.log('worker got msg')
  const { data } = event
  switch (data.command) {
    case actions.START_COLLECTING_DATA:
      console.log('[WORKER] start collecting data')
      break
    case actions.STOP_COLLECTING_DATA:
      console.log('[WORKER] stop collecting data')
      break
    default:
      break
  }
}