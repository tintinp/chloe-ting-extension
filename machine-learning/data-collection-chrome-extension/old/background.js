import AudioContextManager from './AudioContextManager.js'
import StateManager from './StateManager.js'
import actions from './actions.js'

const main = async () => {
  const stateManager = new StateManager()
  const audioContextManager = new AudioContextManager()

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch(msg.type) {
      case actions.GET_STATES:
        const states = stateManager.getState()
        sendResponse({
          payload: { states }
        })
        break
      case actions.GET_ALL_TABS:
        chrome.tabs.query({}, (tabs) => {
          sendResponse({
            payload: { tabs }
          })
        })
        break
      case actions.TAB_SELECTED:
        chrome.tabs.query({ title: msg.payload.selected }, (tabs) => {
          stateManager.setSelectedTabId(tabs[0].id)
          sendResponse({ response: 'Done'})
        })
        break
      case actions.CLASS_SELECTED:
        stateManager.setSelectedClass(msg.payload.selected)
        sendResponse({ response: 'Done'})
        break
      case actions.SAMPLE_LENGTH_CHANGED:
        stateManager.setsampleLength(msg.payload.length)
        sendResponse({ response: 'Done'})
        break
      case actions.SWITCH_CHANGED:
        stateManager.setCollectingData(msg.payload.value)
        sendResponse({ response: 'Done'})
        break
      case actions.START_COLLECTING_DATA:
        // audioContextManager.getAnalyzer
        break
      case 'RTC_PEER_CONNECTION_ANSWER':
        console.log('got des', msg.payload.description)
        break
      default:
        sendResponse({ response: 'Invalid message type' })
        break
    }
    return true;
  });
}

main()