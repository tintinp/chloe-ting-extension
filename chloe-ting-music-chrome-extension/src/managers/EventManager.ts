import { CONSTANTS } from '../constants/constants'
import EventEmitter from 'events'

/**
 * Create chrome port for communication between background layer and popup layer
 */
class EventManager extends EventEmitter {
  private handleCrossLayerConnection: any

  constructor() {
    super()
    this.handleCrossLayerConnection = null
    this.initPort()
  }

  initHandler() {
    this.handleCrossLayerConnection = (port: chrome.runtime.Port) => {
      if (port.name === CONSTANTS.PORTS.CROSS_LAYER) {
        // Receive message in the form of
        // { type: 'TYPE', payload: { key: value }}
        port.onMessage.addListener((msg) => {
          this.sendMessage(msg.type, {
            ...msg.payload
          })
        })

        port.onDisconnect.addListener(() => {})
      }
    }
  }

  initPort() {
    this.initHandler()
    chrome.runtime.onConnect.addListener(this.handleCrossLayerConnection)
  }

  sendMessage(msgName: string, payload: any) {
    this.emit(msgName, payload)
  }
}

// Export as a singleton
export default new EventManager()
