import { createStore } from 'redux'
import { mainReducers } from './reducers'

export const store = createStore(mainReducers)
