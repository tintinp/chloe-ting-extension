import actions from './actions.js'
import constants from './constants.js'

const getStateFromBackground = async () => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: actions.GET_STATES}, (response) => {
      resolve(response.payload.states)
    })
  })
}

const getTabState = async (selectedTabId) => {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: actions.GET_ALL_TABS }, (response) => {
      const { payload } = response
      const tabSelector = $('#tab_selector')
      payload.tabs.forEach((tab) => {
        const option = document.createElement('option')
        option.innerHTML = tab.title
        option.setAttribute('id', tab.id)
        tabSelector.append(option)
        if (selectedTabId === tab.id) {
          tabSelector.val(tab.title)
        }
      })
      resolve()
    })
  })
}

const setClassMarkingState = (selectedClass) => {
  switch (selectedClass) {
    case constants.CHLOE:
      $('#chloe_btn').addClass('selected')
      break
    case constants.BEEP:
      $('#beep_btn').addClass('selected')
      break
    case constants.MUSIC:
      $('#music_btn').addClass('selected')
      break
    default:
      break
  }
}

const checkElementDisable = async () => {
  const {
    canChange,
    canCollectData
  } = await getStateFromBackground()
  if (canChange) {
    $('#tab_selector').prop('disabled', false)
    $('#sample_length').prop('disabled', false)
    $('#export_btn').removeClass('disabled')    
  } else {
    $('#tab_selector').prop('disabled', true)
    $('#sample_length').prop('disabled', true)
    $('#export_btn').addClass('disabled')
  }
  if (canCollectData) {
    $('#switch').prop('disabled', false)
  } else {
    $('#switch').prop('disabled', true)
  }
}

const setSampleLengthState = (sampleLength) => {
  $('#sample_length').val(sampleLength)
}

const setCollectDataState = (collectingData) => {
  $('#switch').prop('checked', collectingData)
}

const attachOnSelectTabListener = () => {
  $('#tab_selector').change((event) => {
    chrome.runtime.sendMessage({ type: actions.TAB_SELECTED, payload: { selected: event.target.value } }, () => {
      chrome.tabs.query({ title: event.target.value }, (tabs) => {
        const id = tabs[0].id
        chrome.tabs.executeScript(id, {
          file: './temp.js'
        })
      })
      checkElementDisable()
    })
  })
}

const attachOnBtnClickListener = () => {
  const chloeBtn = $('#chloe_btn')
  const beepBtn = $('#beep_btn')
  const musicBtn = $('#music_btn')

  chloeBtn.click(() => {
    chloeBtn.addClass('selected')
    beepBtn.removeClass('selected')
    musicBtn.removeClass('selected')
    chrome.runtime.sendMessage({ type: actions.CLASS_SELECTED, payload: { selected: constants.CHLOE } })
  })

  beepBtn.click(() => {
    beepBtn.addClass('selected')
    chloeBtn.removeClass('selected')
    musicBtn.removeClass('selected')
    chrome.runtime.sendMessage({ type: actions.CLASS_SELECTED, payload: { selected: constants.BEEP } })
  })

  musicBtn.click(() => {
    musicBtn.addClass('selected')
    beepBtn.removeClass('selected')
    chloeBtn.removeClass('selected')
    chrome.runtime.sendMessage({ type: actions.CLASS_SELECTED, payload: { selected: constants.MUSIC } })
  })
}

const attachOnSampleLengthChange = () => {
  $('#sample_length').on('input', (event) => {
    chrome.runtime.sendMessage({ type: actions.SAMPLE_LENGTH_CHANGED, payload: { length: event.target.value }}, () => {
      checkElementDisable()
    })
  })
}

const attachOnSwitchChanged = () => {
  $('#switch').change(() => {
    chrome.runtime.sendMessage({ type: actions.SWITCH_CHANGED, payload: { value: $('#switch').prop('checked') }}, () => {
      checkElementDisable()
    })
  })
  
}

const getStatesFromBackground = async () => {
  const {
    selectedTabId,
    selectedClass,
    sampleLength,
    collectingData,
  } = await getStateFromBackground()

  await getTabState(selectedTabId)
  setClassMarkingState(selectedClass)
  setSampleLengthState(sampleLength)
  setCollectDataState(collectingData)
  await checkElementDisable()
}

const attachListeners = () => {
  attachOnSelectTabListener()
  attachOnBtnClickListener()
  attachOnSampleLengthChange()
  attachOnSwitchChanged()
}

const main = async () => {
  await getStatesFromBackground()
  attachListeners()
 
}

main()

const peerConnections = {}
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const { payload } = msg
  const tabId = sender.tab.id
  switch (msg.type) {
    case 'RTC_PEER_CONNECTION_CLIENT':
      const peerConnection = new RTCPeerConnection(config);
      peerConnections[tabId] = peerConnection
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          chrome.tabs.sendMessage(tabId, { type: 'RTC_PEER_CONNECTION_ADD_CANDIDATE',  payload: { candidate: event.candidate } });
        }
      }
      peerConnection.addTransceiver('audio');
      // peerConnection.addTransceiver('video');
      peerConnection.onconnectionstatechange = (event) => {
        console.log('pc', peerConnection.connectionState, event)
      }
      peerConnection
        .createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(() => {
          chrome.tabs.sendMessage(tabId, {
            type: 'RTC_PEER_CONNECTION_OFFER',
            payload: { description: peerConnection.localDescription } 
          })
        });

      peerConnection.ontrack = event => {
        const audioElement = new Audio()
        audioElement.srcObject = event.streams[0]
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const currAudioContext = new AudioContext()
        const source = currAudioContext.createMediaStreamSource(event.streams[0]);
        let analyzer = Meyda.createMeydaAnalyzer({
          audioContext: currAudioContext,
          source: source,
          bufferSize:512,
          featureExtractors:['rms'],
          callback:(features) => {
            console.log(features);
          }
        })
        analyzer.start();
      }
      break
    case 'RTC_PEER_CONNECTION_ANSWER':
      console.log('got des', payload.description)
      peerConnections[tabId].setRemoteDescription(payload.description);
      console.log(peerConnections)
      break
    case 'RTC_PEER_CONNECTION_ADD_CANDIDATE':
      console.log('popup new candidate', payload.candidate)
      peerConnections[tabId].addIceCandidate(payload.candidate)
      break
  }
})
