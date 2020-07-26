import {
  ADD_LOG,
  ADD_TABS,
  CLEAR_LOG,
  REMOVE_TAB_BY_ID,
  SELECTED_CLASS_CHANGE,
  SELECTED_TAB_CHANGE,
  SET_ACTIVE_SIGNAL,
  SET_EXPORT_STATUS,
  SET_SAMPLE_LENGTH,
  TOGGLE_START_STOP,
  UPDATE_COUNT
} from './actions'
import { cloneDeep, isNumber } from 'lodash'

import CONSTANTS from '../constants/CONSTANTS'
import { combineReducers } from 'redux'

const defaultStatsState = {
  logs: '',
  chloeSampleCount: 0,
  beepSampleCount: 0,
  musicSampleCount: 0
}

const defaultDashboardState = {
  selectedTabId: null,
  selectedClass: null,
  sampleLength: CONSTANTS.DEFAULT_SAMPLE_LENGTH,
  collectingData: false,
  activeSignal: false,
  exportingCSV: false,
  tabs: {}
}

const statsStates = (state = defaultStatsState, action) => {
  switch (action.type) {
    case ADD_LOG:
      return {
        ...state,
        logs: state.logs + `\n[${parseInt(Date.now() / 1000)}] ${action.payload}`
      }
    case CLEAR_LOG:
      return {
        ...state,
        log: ''
      }
    case UPDATE_COUNT:
      return {
        ...state,
        ...action.payload
      }
    default:
      return { ...state }
  }
}

const dashboardStates = (state = defaultDashboardState, action) => {
  let tabs
  switch (action.type) {
    case SELECTED_CLASS_CHANGE:
      return {
        ...state,
        ...action.payload
      }
    case SELECTED_TAB_CHANGE:
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
    case SET_ACTIVE_SIGNAL:
      return {
        ...state,
        ...action.payload
      }
    case SET_EXPORT_STATUS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return { ...state }
  }
}

const mainReducers = combineReducers({
  dashboardStates,
  statsStates
})

export default mainReducers
