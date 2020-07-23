import CONSTANTS from '../constants/CONSTANTS'

export const ADD_LOG = 'ADD_LOG'
export const CLEAR_LOG = 'CLEAR_LOG'
export const SELECTED_CLASS_CHANGE = 'SELECTED_CLASS_CHANGE'
export const SELECTED_TAB_CHANGE = 'SELECTED_TAB_CHANGE'
export const ADD_TABS = 'ADD_TABS'
export const UPDATE_COUNT = 'UPDATE_COUNT'
export const REMOVE_TAB_BY_ID = 'REMOVE_TAB_BY_ID'
export const TOGGLE_START_STOP = 'TOGGLE_START_STOP'
export const SET_SAMPLE_LENGTH = 'SET_SAMPLE_LENGTH'

export const setSelectedClass = (selectedClass) => {
  return {
    type: SELECTED_CLASS_CHANGE,
    payload: {
      selectedClass: selectedClass
    }
  }
}

export const setSelectedTabId = (id) => {
  return {
    type: SELECTED_TAB_CHANGE,
    payload: {
      selectedTabId: id
    }
  }
}

export const addTabs = (tabs) => {
  return {
    type: ADD_TABS,
    payload: {
      tabs: tabs
    }
  }
}

export const removeTabById = (id) => {
  return {
    type: REMOVE_TAB_BY_ID,
    payload: {
      tabId: id
    }
  }
}

export const setSampleLength = (sampleLength) => {
  return {
    type: SET_SAMPLE_LENGTH,
    payload: {
      sampleLength: sampleLength
    }
  }
}

export const toggleStartStop = () => {
  return {
    type: TOGGLE_START_STOP
  }
}

export const updateCount = (type, count) => {
  let payload = {}
  switch (type) {
    case CONSTANTS.CHLOE:
      payload = { chloeSampleCount: count }
      break
    case CONSTANTS.BEEP:
      payload = { beepSampleCount: count }
      break
    case CONSTANTS.MUSIC:
      payload = { musicSampleCount: count }
      break
    default:
      break
  }
  return {
    type: UPDATE_COUNT,
    payload
  }
}

export const addLog = (text) => {
  return {
    type: ADD_LOG,
    payload: text
  }
}

export const clearLog = () => {
  return {
    type: CLEAR_LOG
  }
}
