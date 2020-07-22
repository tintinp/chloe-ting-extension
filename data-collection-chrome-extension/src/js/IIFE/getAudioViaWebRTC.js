/** IIFE file for executing script on specific tab.
 * Be sure to edit webpack.config.js if location or name of this file changes.
 * 
 * Currently inside webpack config under plugins,
 * ...
 * ...
 * plugins: [
    ...
    ...
    new CopyWebpackPlugin({
      patterns: [{ from: './src/js/IIFE/getAudioViaWebRTC.js' }]
    }),
    ...
    ...
    new MiniCssExtractPlugin(),
    new WriteFilePlugin()
  ]
 *
 * This will copy getAudioViaWebRTC.js to the 'build' folder when building with webpack.
 */

// WebRTC Peer Caller
// Offer audio stream to peer callee (on AudioContextManager)
// Using WebRTC Peer Connection to send audio stream from any particular tab to background.js for signal processing
;(() => {
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // Set up
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  // Peer connection set up
  let peerConnection
  let time = Date.now()
  const config = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302']
      }
    ]
  }

  // Connect to WEB_RTC port
  const port = chrome.runtime.connect({ name: 'WEB_RTC' })

  // Get media source
  let media
  const audio = document.querySelector('audio')
  const video = document.querySelector('video')
  if (video) {
    media = video
  } else if (audio) {
    media = audio
  } else {
    port.postMessage({
      type: 'PEER_CONNECTION_ERROR',
      error: 'No video or audio source found on this tab'
    })
    port.disconnect()
    return
  }
  const stream = media.captureStream()

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // Handle WebRTC protocol
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  const handleWebRTCSetup = (msg) => {
    switch (msg.type) {
      // ----------------------------------------------------------------------
      // Send offer
      // ----------------------------------------------------------------------
      case 'PEER_CONNECTION_RECEIVER_READY':
        peerConnection = new RTCPeerConnection(config)

        // On receiving candidate, send candidate over to the receiver peer
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            port.postMessage({
              type: 'PEER_CONNECTION_SENDER_CANDIDATE',
              candidate: event.candidate
            })
          }
        }

        // Add audio tracks and stream
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

        // Peer connection states
        peerConnection.onconnectionstatechange = () => {
          console.log(`[${Date.now()}] Peer connection state: ${peerConnection.connectionState}`)
        }

        // Create offer to offer audio to the receiver peer
        peerConnection
          .createOffer()
          .then((sdp) => peerConnection.setLocalDescription(sdp))
          .then(() => {
            port.postMessage({
              type: 'PEER_CONNECTION_OFFER',
              description: peerConnection.localDescription
            })
          })
        break

      // ----------------------------------------------------------------------
      // Receive answer, set remote description got from recevier peer
      // ----------------------------------------------------------------------
      case 'PEER_CONNECTION_ANSWER':
        peerConnection.setRemoteDescription(msg.description)
        break

      // ----------------------------------------------------------------------
      // Add candidate from receiver peer
      // ----------------------------------------------------------------------
      case 'PEER_CONNECTION_RECEIVER_CANDIDATE':
        peerConnection.addIceCandidate(msg.candidate)
        break

      case 'PEER_CONNECTION_CLOSE':
        peerConnection.close()
        port.onMessage.removeListener(handleWebRTCSetup)
        port.disconnect()
        console.log('Peer connection closed')
        peerConnection = null
        break
      default:
        break
    }
  }

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // Init WebRTC handshake protocol with receiver peer
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  // Add listeners for WebRTC hand shake protocol
  port.onMessage.addListener(handleWebRTCSetup)

  // Initiate connection with peer connection over in AudioContextManager (background.js)
  port.postMessage({ type: 'PEER_CONNECTION_SENDER_READY' })
})()
