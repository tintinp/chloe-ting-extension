(() => {
  let peerConnection
  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"]
      }
    ]
  }

  const handleRTCSetup = (msg) => {
    const { payload } = msg
    switch (msg.type) {
      case 'RTC_PEER_CONNECTION_OFFER':
        peerConnection = new RTCPeerConnection(config);
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        peerConnection
          .setRemoteDescription(payload.description)
          .then(() => peerConnection.createAnswer())
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => {
            chrome.runtime.sendMessage({
              type: 'RTC_PEER_CONNECTION_ANSWER',
              payload: { description: peerConnection.localDescription }
            })
          })
        
        

        peerConnection.onicecandidate = event => {
          if (event.candidate) {
            chrome.runtime.sendMessage({
              type: 'RTC_PEER_CONNECTION_ADD_CANDIDATE',
              payload: { candidate: event.candidate }
            })            
            // chrome.runtime.onMessage.removeListener(handleRTCSetup)
          }
        }
        break
      case 'RTC_PEER_CONNECTION_ADD_CANDIDATE':
        console.log('temp new candidate', payload.candidate)
        peerConnection.addIceCandidate(payload.candidate)
        break
    }
  }
  // const audio = document.querySelector('audio')
  const video = document.querySelector('video')


  
  var stream = video.captureStream();
  
  chrome.runtime.sendMessage({
    type: 'RTC_PEER_CONNECTION_CLIENT',
    payload: {}
  })
  chrome.runtime.onMessage.addListener(handleRTCSetup)
})()
