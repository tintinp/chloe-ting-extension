export const ADD_LOG = 'ADD_LOG'
export const CHANGE_DATA_STAT = 'CHANGE_DATA_STAT'
export const CHANGE_DASHBOARD_STATE = 'CHANGE_DASHBOARD_STATE'

export const addLog = (data) => {
  return {
    type: ADD_LOG,
    payload: {
      ...data
    }
  }
}
