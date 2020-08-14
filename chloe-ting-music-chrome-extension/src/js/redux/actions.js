export const WORKOUT_TAB_CHANGE = 'WORKOUT_TAB_CHANGE'
export const MUSIC_TAB_CHANGE = 'MUSIC_TAB_CHANGE'
export const ADD_TABS = 'ADD_TABS'
export const REMOVE_TAB_BY_ID = 'REMOVE_TAB_BY_ID'
export const TOGGLE_START_STOP = 'TOGGLE_START_STOP'

export const setWorkoutTab = (id) => {
  return {
    type: WORKOUT_TAB_CHANGE,
    payload: {
      tabId: id
    }
  }
}

export const setMusicTab = (id) => {
  return {
    type: MUSIC_TAB_CHANGE,
    payload: {
      tabId: id
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
