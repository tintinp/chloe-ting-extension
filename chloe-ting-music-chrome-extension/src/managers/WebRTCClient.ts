import { CONSTANTS } from '../constants/constants'

const config = {
  iceServers: [
    {
      urls: ['stun:stun.l.google.com:19302']
    }
  ]
}

export class WebRTCClient {
  private port: chrome.runtime.Port | null
  private peerConnection: RTCPeerConnection | null
  private mediaStream: MediaStream | null
  private handleWebRTC: any

  constructor() {
    this.init()
    this.port = null
    this.peerConnection = null
    this.mediaStream = null
  }

  init() {
    this.handleWebRTC = (port: chrome.runtime.Port) => {
      if (port.name === CONSTANTS.PORTS.WEB_RTC) {
        if (!this.port) {
          this.port = port
        }
        console.log('Target tab connected to chrome communication port', port)
        port.onMessage.addListener((msg) => {
          switch (msg.type) {
            // ----------------------------------------------------------------------
            // Start handshake protocol when sender peer is ready
            // ----------------------------------------------------------------------
            case CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_SENDER_READY:
              port.postMessage({
                type: CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_RECEIVER_READY
              })
              break

            // ----------------------------------------------------------------------
            // Receiver offer, send answer back to sender peer
            // ----------------------------------------------------------------------
            case CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_OFFER:
              this.peerConnection = new RTCPeerConnection(config)

              // On receiving candidate, send candidate over to the other peer
              this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                  port.postMessage({
                    type: CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_RECEIVER_CANDIDATE,
                    candidate: event.candidate
                  })
                }
              }

              // On getting tracks and streams
              this.peerConnection.ontrack = (event) => {
                this.mediaStream = event.streams[0]
              }

              // Create answer to reply to sender's offer
              this.peerConnection
                .setRemoteDescription(msg.description)
                .then(() => this.peerConnection!.createAnswer())
                .then((sdp) => this.peerConnection!.setLocalDescription(sdp))
                .then(() => {
                  port.postMessage({
                    type: CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_ANSWER,
                    description: this.peerConnection!.localDescription
                  })
                })
              break

            // ----------------------------------------------------------------------
            // Add candidate from sender peer
            // ----------------------------------------------------------------------
            case CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_SENDER_CANDIDATE:
              this.peerConnection && this.peerConnection.addIceCandidate(msg.candidate)
              break

            case CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_ERROR:
              console.log('WebRTC peer connection error:', msg.error)
              break
            default:
              break
          }
        })

        // ----------------------------------------------------------------------
        // Handle disconnection
        // ----------------------------------------------------------------------
        port.onDisconnect.addListener((port) => {
          console.log('Tab disconnected from chrome communication port', port)
          this.port = null
        })
      }
    }

    chrome.runtime.onConnect.addListener(this.handleWebRTC)
  }

  getStream() {
    return this.mediaStream
  }

  closeConnection() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    if (this.port) {
      this.port.postMessage({ type: CONSTANTS.WEB_RTC_EVENTS.PEER_CONNECTION_CLOSE })
      this.port = null
    }
    chrome.runtime.onConnect.removeListener(this.handleWebRTC)
    this.mediaStream = null
  }
}
