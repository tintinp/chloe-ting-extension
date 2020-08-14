import {
  ADD_TABS,
  MUSIC_TAB_CHANGE,
  REMOVE_TAB_BY_ID,
  TOGGLE_START_STOP,
  WORKOUT_TAB_CHANGE
} from './actions'

import { cloneDeep } from 'lodash'
import { combineReducers } from 'redux'

const defaultAppState = {
  toggleOn: false,
  selectedTabId: {
    workout: null,
    music: null
  },
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
  let tabs
  switch (action.type) {
    case WORKOUT_TAB_CHANGE:
      return {
        ...state,
        selectedTabId: { ...state.selectedTabId, workout: action.payload.tabId }
      }
    case MUSIC_TAB_CHANGE:
      return {
        ...state,
        selectedTabId: { ...state.selectedTabId, music: action.payload.tabId }
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
      const workoutTabId =
        action.payload.tabId === state.selectedTabId.workout ? null : state.selectedTabId.workout
      const musicTabId =
        action.payload.tabId === state.selectedTabId.music ? null : state.selectedTabId.music
      delete tabs[action.payload.tabId]
      return {
        ...state,
        selectedTabId: { workout: workoutTabId, music: musicTabId },
        tabs
      }
    case TOGGLE_START_STOP:
      return {
        ...state,
        toggleOn: !state.toggleOn
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
