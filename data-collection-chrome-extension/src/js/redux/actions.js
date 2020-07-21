export const ADD_LOG = 'ADD_LOG'
export const CHANGE_DATA_STAT = 'CHANGE_DATA_STAT'
export const CHANGE_DASHBOARD_STATE = 'CHANGE_DASHBOARD_STATE'
export const ADD_TABS = 'ADD_TABS'
export const REMOVE_TAB_BY_ID = 'REMOVE_TAB_BY_ID'
export const TOGGLE_START_STOP = 'TOGGLE_START_STOP'
export const SET_SAMPLE_LENGTH = 'SET_SAMPLE_LENGTH'

export const setSelectedClass = (selectedClass) => {
  return {
    type: CHANGE_DASHBOARD_STATE,
    payload: {
      selectedClass: selectedClass
    }
  }
}

export const setSelectedTabId = (id) => {
  return {
    type: CHANGE_DASHBOARD_STATE,
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
