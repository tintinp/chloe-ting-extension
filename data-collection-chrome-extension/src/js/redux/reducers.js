import {
  ADD_LOG,
  ADD_TABS,
  CHANGE_DASHBOARD_STATE,
  CHANGE_DATA_STAT,
  REMOVE_TABS,
  SET_SAMPLE_LENGTH,
  TOGGLE_START_STOP
} from './actions'
import { cloneDeep, isNumber, keys, map } from 'lodash'

import CONSTANTS from '../constants/CONSTANTS'
import { combineReducers } from 'redux'

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
  switch (action.type) {
    case CHANGE_DASHBOARD_STATE:
      return {
        ...state,
        ...action.payload
      }
    case ADD_TABS:
      let tabs = cloneDeep(state.tabs)
      action.payload.tabs.forEach((tab) => {
        tabs[tab.id] = tab.title
      })
      return {
        ...state,
        tabs
      }
    // case REMOVE_TABS:
    //   const currentTabs = {}
    //   return {
    //     ...state,
    //     ...currentTabs
    //   }
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
    default:
      return { ...state }
  }
}

const mainReducers = combineReducers({
  dashboardStates,
  logs
})

export default mainReducers
