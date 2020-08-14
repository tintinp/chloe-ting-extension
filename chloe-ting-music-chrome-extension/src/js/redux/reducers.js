import {
  ADD_TABS,
  REMOVE_TAB_BY_ID,
  SELECTED_TAB_CHANGE,
  SET_ACTIVE_SIGNAL,
  TOGGLE_START_STOP
} from './actions'
import { cloneDeep, isNumber } from 'lodash'

import CONSTANTS from '../constants/CONSTANTS'
import { combineReducers } from 'redux'

const defaultAppState = {
  toggleOn: false,
  selectedTabId: null,
  tabs: {}
}

const modelState = (state = defaultAppState, action) => {
  switch (action.type) {
    case ADD_TABS:
      return {
        ...state
      }
    default:
      return { ...state }
  }
}

const appState = (state = defaultAppState, action) => {
  switch (action.type) {
    case ADD_TABS:
      return {
        ...state
      }
    default:
      return { ...state }
  }
}

const mainReducers = combineReducers({
  appState,
  modelState
})

export default mainReducers
