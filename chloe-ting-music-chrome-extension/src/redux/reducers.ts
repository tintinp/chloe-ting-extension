import { TabAction, TabActionType, UIAction, UIActionType } from './actions'

import { cloneDeep } from 'lodash'
import { combineReducers } from 'redux'

export interface AppState {
  toggleOn: boolean
  selectedTabId: {
    workout?: number
    music?: number
  }
  tabs: Record<number, string>
}

const defaultAppState: AppState = {
  toggleOn: false,
  selectedTabId: { workout: undefined, music: undefined },
  tabs: {}
}

// TODO: this is just temp, change action type to not be AppAction
// const modelState = (state = defaultAppState, action: AppAction) => {
//   switch (action.type) {
//     case TabAction.ADD_TABS:
//       return {
//         ...state
//       }
//     default:
//       return { ...state }
//   }
// }

const appState = (state = defaultAppState, action: UIAction | TabAction) => {
  let tabs: Record<number, string>

  console.log(`reducer state`, state)
  console.log(`reducer action`, action)
  switch (action.type) {
    case UIActionType.WORKOUT_TAB_CHANGE:
      return {
        ...state,
        selectedTabId: { ...state.selectedTabId, workout: action.payload?.tabId }
      }
    case UIActionType.MUSIC_TAB_CHANGE:
      return {
        ...state,
        selectedTabId: { ...state.selectedTabId, music: action.payload?.tabId }
      }
    case UIActionType.TOGGLE_START_STOP:
      return {
        ...state,
        toggleOn: !state.toggleOn
      }
    case TabActionType.ADD_TABS:
      tabs = cloneDeep(state.tabs)
      action.payload?.tabs?.forEach((tab) => {
        if (tab && tab.id && !isNaN(tab.id) && tab.title) {
          tabs[tab.id] = tab.title
        }
      })
      return {
        ...state,
        tabs
      }
    case TabActionType.REMOVE_TAB_BY_ID:
      tabs = cloneDeep(state.tabs)
      const workoutTabId =
        action.payload?.tabId === state.selectedTabId.workout
          ? undefined
          : state.selectedTabId.workout
      const musicTabId =
        action.payload?.tabId === state.selectedTabId.music ? undefined : state.selectedTabId.music
      action.payload?.tabId && delete tabs[action.payload.tabId]
      return {
        ...state,
        selectedTabId: { workout: workoutTabId, music: musicTabId },
        tabs
      }
    default:
      return { ...state }
  }
}

export const mainReducers = combineReducers({
  appState
  // modelState
})
