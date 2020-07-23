import CONSTANTS from '../constants/CONSTANTS'
import EventEmitter from 'events'

/**
 * Create chrome port for communication between background layer and popup layer
 */
class EventManager extends EventEmitter {
  constructor() {
    super()
    this.handleCrossLayerConnection = null
    this.initPort()
  }

  initHandler() {
    this.handleCrossLayerConnection = (port) => {
      if (port.name === CONSTANTS.PORTS.CROSS_LAYER) {
        port.onMessage.addListener((msg) => {
          switch (msg.type) {
            case CONSTANTS.EVENTS.START_COLLECTING_DATA:
              this.sendMessage(CONSTANTS.EVENTS.START_COLLECTING_DATA, {
                selectedTabId: msg.payload.selectedTabId
              })

            case CONSTANTS.EVENTS.SELECTED_CLASS_CHANGE:
              this.sendMessage(CONSTANTS.EVENTS.SELECTED_CLASS_CHANGE, {
                selectedClass: msg.payload.selectedClass
              })
              break

            case CONSTANTS.EVENTS.STOP_COLLECTING_DATA:
              this.sendMessage(CONSTANTS.EVENTS.STOP_COLLECTING_DATA)
              break
            default:
              break
          }
        })

        port.onDisconnect.addListener(() => {})
      }
    }
  }

  initPort() {
    this.initHandler()
    chrome.runtime.onConnect.addListener(this.handleCrossLayerConnection)
  }

  sendMessage(msgName, payload) {
    this.emit(msgName, payload)
  }
}

// Export as a singleton
export default new EventManager()
