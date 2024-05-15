import { AppState } from '../redux/reducers'
import { Store } from 'redux'
import { WebRTCClient } from './WebRTCClient'

const MAX_RETRY = 5
const RETRY_WAIT_TIME = 500

type AudioContextManagerOptions = {
  store: Store
}

async function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

class AudioContextManager {
  private peerReceiver: WebRTCClient | null
  private stream: MediaStream | null
  private store: Store<AppState>

  constructor(options: AudioContextManagerOptions) {
    this.peerReceiver = null
    this.stream = null
    this.store = options.store
  }

  async getAudioStream(selectedTabId: number) {
    console.log('Set up WebRTC peer to receiver audio from tab', selectedTabId)
    this.peerReceiver = new WebRTCClient()
    chrome.tabs.executeScript(selectedTabId, {
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
    if (this.peerReceiver) {
      this.peerReceiver.closeConnection()
    }
    this.peerReceiver = null
    this.stream = null
  }
}

export default AudioContextManager
