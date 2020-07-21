import { ADD_LOG, CHANGE_DASHBOARD_STATE, CHANGE_DATA_STAT } from './actions'

import CONSTANTS from '../../constants/CONSTANTS'
import { combineReducers } from 'redux'

const defaultDashboardState = {
  selectedTabId: null,
  selectedClass: null,
  sampleLength: CONSTANTS.DEFAULT_SAMPLE_LENGTH,
  collectingData: false,
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
    default:
      return state
  }
}

const mainReducers = combineReducers({
  dashboardStates,
  logs
})

export default mainReducers
