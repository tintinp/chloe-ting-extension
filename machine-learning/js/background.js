import actions from './actions.js'

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch(msg.type) {
    case actions.GET_ALL_TABS:
      chrome.tabs.query({}, (tabs) => {
        sendResponse({
          payload: { tabs }
        })
      })
      break
    default:
      break
  }
  return true;
});

