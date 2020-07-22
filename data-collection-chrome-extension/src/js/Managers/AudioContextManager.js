import WebRTCClient from './WebRTCClient'
import wait from '../Utils/wait'

const MAX_RETRY = 5
const RETRY_WAIT_TIME = 500

class AudioContextManager {
  constructor() {
    this.peerReceiver = null
    this.stream = null
  }

  async getAudioStream(tabId) {
    console.log('Set up WebRTC peer to receiver audio from tab', tabId)
    this.peerReceiver = new WebRTCClient()
    chrome.tabs.executeScript(tabId, {
      file: 'getAudioViaWebRTC.js'
    })

    let attempt = 1
    while (!this.stream) {
      if (attempt > MAX_RETRY) {
        throw new Error('Unable to get audio stream')
      }
      attempt += 1
      await wait(RETRY_WAIT_TIME)
      // NOTE TIN: In case when calling stopStream() while getAudioStream is executing
      // this.peerReceiver could already been set to null
      if (this.peerReceiver) {
        this.stream = this.peerReceiver.getStream()
      }
    }

    console.log('Got audio stream')
    return this.stream
  }

  stopStream() {
    this.peerReceiver.closeConnection()
    this.peerReceiver = null
    this.stream = null
  }
}

export default AudioContextManager
