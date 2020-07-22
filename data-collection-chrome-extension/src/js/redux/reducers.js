import {
  ADD_LOG,
  ADD_TABS,
  CHANGE_DASHBOARD_STATE,
  CHANGE_DATA_STAT,
  REMOVE_TAB_BY_ID,
  SET_SAMPLE_LENGTH,
  TOGGLE_START_STOP
} from './actions'
import { cloneDeep, isNumber } from 'lodash'

import CONSTANTS from '../constants/CONSTANTS'
import { combineReducers } from 'redux'
import eventManager from '../Managers/EventManager'

const defaultDashboardState = {
  selectedTabId: null,
  selectedClass: null,
  sampleLength: CONSTANTS.DEFAULT_SAMPLE_LENGTH,
  collectingData: false,
  activeSignal: false,
  tabs: {}
}

const logs = (state = {}, action) => {
  switch (action.type) {
    case CHANGE_DATA_STAT:
      return {
        ...state,
        ...action.payload
      }
    case ADD_LOG:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

const dashboardStates = (state = defaultDashboardState, action) => {
  let tabs
  switch (action.type) {
    case CHANGE_DASHBOARD_STATE:
      return {
        ...state,
        ...action.payload
      }
    case ADD_TABS:
      tabs = cloneDeep(state.tabs)
      action.payload.tabs.forEach((tab) => {
        if (tab) {
          tabs[tab.id] = tab.title
        }
      })
      return {
        ...state,
        tabs
      }
    case REMOVE_TAB_BY_ID:
      tabs = cloneDeep(state.tabs)
      const selectedTabId =
        action.payload.tabId === state.selectedTabId ? null : state.selectedTabId
      delete tabs[action.payload.tabId]
      return {
        ...state,
        selectedTabId: selectedTabId,
        tabs
      }
    case TOGGLE_START_STOP:
      if (state.collectingData) {
        eventManager.sendMessage(CONSTANTS.EVENTS.STOP_COLLECTING_DATA)
      } else {
        eventManager.sendMessage(CONSTANTS.EVENTS.START_COLLECTING_DATA, {
          selectedTabId: state.selectedTabId,
          selectedClass: state.selectedClass,
          sampleLength: state.sampleLength
        })
      }
      return {
        ...state,
        collectingData: !state.collectingData
      }
    case SET_SAMPLE_LENGTH:
      let length = isNumber(action.payload.sampleLength) ? action.payload.sampleLength : null
      return {
        ...state,
        sampleLength: length
      }
    default:
      return { ...state }
  }
}

const mainReducers = combineReducers({
  dashboardStates,
  logs
})

export default mainReducers
