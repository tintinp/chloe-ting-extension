import EventEmitter from 'events'

class EventManager extends EventEmitter {
  constructor() {
    super()
  }

  sendMessage(msgName, payload) {
    this.emit(msgName, payload)
  }
}

export default new EventManager()
