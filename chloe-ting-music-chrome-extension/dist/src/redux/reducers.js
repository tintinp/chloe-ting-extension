import { TabActionType, UIActionType } from './actions';
import { cloneDeep } from 'lodash';
import { combineReducers } from 'redux';
const defaultAppState = {
    toggleOn: false,
    selectedTabId: { workout: undefined, music: undefined },
    tabs: {}
};
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
const appState = (state = defaultAppState, action) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let tabs;
    console.log(`reducer state`, state);
    console.log(`reducer action`, action);
    switch (action.type) {
        case UIActionType.WORKOUT_TAB_CHANGE:
            return Object.assign(Object.assign({}, state), { selectedTabId: Object.assign(Object.assign({}, state.selectedTabId), { workout: (_a = action.payload) === null || _a === void 0 ? void 0 : _a.tabId }) });
        case UIActionType.MUSIC_TAB_CHANGE:
            return Object.assign(Object.assign({}, state), { selectedTabId: Object.assign(Object.assign({}, state.selectedTabId), { music: (_b = action.payload) === null || _b === void 0 ? void 0 : _b.tabId }) });
        case UIActionType.TOGGLE_START_STOP:
            return Object.assign(Object.assign({}, state), { toggleOn: !state.toggleOn });
        case TabActionType.ADD_TABS:
            tabs = cloneDeep(state.tabs);
            (_d = (_c = action.payload) === null || _c === void 0 ? void 0 : _c.tabs) === null || _d === void 0 ? void 0 : _d.forEach((tab) => {
                if (tab && tab.id && !isNaN(tab.id) && tab.title) {
                    tabs[tab.id] = tab.title;
                }
            });
            return Object.assign(Object.assign({}, state), { tabs });
        case TabActionType.REMOVE_TAB_BY_ID:
            tabs = cloneDeep(state.tabs);
            const workoutTabId = ((_e = action.payload) === null || _e === void 0 ? void 0 : _e.tabId) === state.selectedTabId.workout
                ? undefined
                : state.selectedTabId.workout;
            const musicTabId = ((_f = action.payload) === null || _f === void 0 ? void 0 : _f.tabId) === state.selectedTabId.music ? undefined : state.selectedTabId.music;
            ((_g = action.payload) === null || _g === void 0 ? void 0 : _g.tabId) && delete tabs[action.payload.tabId];
            return Object.assign(Object.assign({}, state), { selectedTabId: { workout: workoutTabId, music: musicTabId }, tabs });
        default:
            return Object.assign({}, state);
    }
};
export const mainReducers = combineReducers({
    appState
    // modelState
});
