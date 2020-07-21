import store from './redux/store'
import { wrapStore } from 'webext-redux'

console.log('Running background.js')
wrapStore(store)
console.log('Store created')
