export var UIActionType;
(function (UIActionType) {
    UIActionType["WORKOUT_TAB_CHANGE"] = "WORKOUT_TAB_CHANGE";
    UIActionType["MUSIC_TAB_CHANGE"] = "MUSIC_TAB_CHANGE";
    UIActionType["TOGGLE_START_STOP"] = "TOGGLE_START_STOP";
})(UIActionType || (UIActionType = {}));
export var TabActionType;
(function (TabActionType) {
    TabActionType["ADD_TABS"] = "ADD_TABS";
    TabActionType["REMOVE_TAB_BY_ID"] = "REMOVE_TAB_BY_ID";
})(TabActionType || (TabActionType = {}));
export const setWorkoutTab = (id) => {
    if (typeof id !== 'number') {
        throw new Error('Tab id is not a number');
    }
    return {
        type: UIActionType.WORKOUT_TAB_CHANGE,
        payload: {
            tabId: id
        }
    };
};
export const setMusicTab = (id) => {
    if (typeof id !== 'number') {
        throw new Error('Tab id is not a number');
    }
    return {
        type: UIActionType.MUSIC_TAB_CHANGE,
        payload: {
            tabId: id
        }
    };
};
export const toggleStartStop = () => {
    return {
        type: UIActionType.TOGGLE_START_STOP,
        payload: {}
    };
};
export const addTabs = (tabs) => {
    return {
        type: TabActionType.ADD_TABS,
        payload: {
            tabs: tabs
        }
    };
};
export const removeTabById = (id) => {
    return {
        type: TabActionType.REMOVE_TAB_BY_ID,
        payload: {
            tabId: id
        }
    };
};
