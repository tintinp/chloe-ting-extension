import { Action } from 'redux'

export enum UIActionType {
  'WORKOUT_TAB_CHANGE' = 'WORKOUT_TAB_CHANGE',
  'MUSIC_TAB_CHANGE' = 'MUSIC_TAB_CHANGE',
  'TOGGLE_START_STOP' = 'TOGGLE_START_STOP'
}

export enum TabActionType {
  'ADD_TABS' = 'ADD_TABS',
  'REMOVE_TAB_BY_ID' = 'REMOVE_TAB_BY_ID'
}

export interface UIAction extends Action {
  type: UIActionType
  payload?: {
    tabId?: number
  }
}
export interface TabAction extends Action {
  type: TabActionType
  payload?: {
    tabs?: chrome.tabs.Tab[]
    tabId?: number
  }
}

export const setWorkoutTab = (id: unknown): UIAction => {
  if (typeof id !== 'number') {
    throw new Error('Tab id is not a number')
  }
  return {
    type: UIActionType.WORKOUT_TAB_CHANGE,
    payload: {
      tabId: id
    }
  }
}

export const setMusicTab = (id: unknown): UIAction => {
  if (typeof id !== 'number') {
    throw new Error('Tab id is not a number')
  }
  return {
    type: UIActionType.MUSIC_TAB_CHANGE,
    payload: {
      tabId: id
    }
  }
}

export const toggleStartStop = (): UIAction => {
  return {
    type: UIActionType.TOGGLE_START_STOP,
    payload: {}
  }
}

export const addTabs = (tabs: chrome.tabs.Tab[]): TabAction => {
  return {
    type: TabActionType.ADD_TABS,
    payload: {
      tabs: tabs
    }
  }
}

export const removeTabById = (id: number): TabAction => {
  return {
    type: TabActionType.REMOVE_TAB_BY_ID,
    payload: {
      tabId: id
    }
  }
}
