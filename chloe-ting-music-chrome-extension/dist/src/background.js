var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { addTabs, removeTabById } from './redux/actions';
import AudioContextManager from './managers/AudioContextManager';
import { CONSTANTS } from './constants/constants';
import { DataManager } from './managers/DataManager';
import eventManager from './managers/EventManager';
import { store } from './redux/store';
import { wrapStore } from 'webext-redux';
const audioContextManager = new AudioContextManager({ store });
const dataManager = new DataManager({ store });
const getAllTabsInfo = () => {
    chrome.tabs.query({}, (tabs) => {
        console.log('query tabs', tabs);
        store.dispatch(addTabs(tabs));
    });
};
const attachTabListeners = () => {
    chrome.tabs.onCreated.addListener((tab) => {
        store.dispatch(addTabs([tab]));
    });
    chrome.tabs.onUpdated.addListener((id) => {
        chrome.tabs.get(id, (tab) => {
            store.dispatch(addTabs([tab]));
        });
    });
    chrome.tabs.onRemoved.addListener((id) => {
        store.dispatch(removeTabById(id));
    });
};
const attachCrossLayerListeners = () => {
    eventManager.on(CONSTANTS.EVENTS.START_PREDICTING, (_a) => __awaiter(void 0, [_a], void 0, function* ({ selectedTabId }) {
        try {
            // const stream = await audioContextManager.getAudioStream(selectedTabId?.workout)
            // dataManager.startExtraction(stream)
        }
        catch (err) {
            console.error('Error starting data collection:', err);
        }
    }));
    eventManager.on(CONSTANTS.EVENTS.STOP_PREDICTING, () => {
        audioContextManager.stopStream();
    });
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Running background.js');
    wrapStore(store);
    getAllTabsInfo();
    attachTabListeners();
    attachCrossLayerListeners();
    console.log('done set up');
    // await dataManager.start()
});
main();
