import constants from "./constants.js"

class StateManager {
  constructor() {
    this.state = {
      selectedTabId: null,
      selectedClass: null,
      sampleLength: constants.DEFAULT_SAMPLE_LENGTH,
      collectingData: false,
    }
  }

  getState() {
    const canChange = !this.state.collectingData
    const canCollectData = this.isNumber(this.state.sampleLength) && this.state.selectedTabId !== null
    return { ...this.state, canChange, canCollectData }
  }

  setSelectedTabId(id) {
    this.state.selectedTabId = id
  }

  setsampleLength(time) {
    const val = parseFloat(time)
    if (!this.isNumber(val) || val <= 0) {
      this.state.sampleLength = null
    } else {
      this.state.sampleLength = val
    }
  }

  setSelectedClass(type) {
    this.state.selectedClass = type
  }

  setCollectingData(bool) {
    this.state.collectingData = bool
  }

  isNumber(value) {
    if (typeof value !== 'number') {
      return false
    }
    if (value !== Number(value)) {
      return false
    }
    return true
  }
}

export default StateManager
