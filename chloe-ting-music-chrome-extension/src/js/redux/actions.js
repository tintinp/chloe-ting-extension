import CONSTANTS from '../constants/CONSTANTS'

export const SELECTED_TAB_CHANGE = 'SELECTED_TAB_CHANGE'
export const ADD_TABS = 'ADD_TABS'
export const REMOVE_TAB_BY_ID = 'REMOVE_TAB_BY_ID'
export const TOGGLE_START_STOP = 'TOGGLE_START_STOP'
export const SET_ACTIVE_SIGNAL = 'SET_ACTIVE_SIGNAL'

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

export const toggleStartStop = () => {
  return {
    type: TOGGLE_START_STOP
  }
}

export const setActiveSignal = (bool) => {
  return {
    type: SET_ACTIVE_SIGNAL,
    payload: { activeSignal: bool }
  }
}
