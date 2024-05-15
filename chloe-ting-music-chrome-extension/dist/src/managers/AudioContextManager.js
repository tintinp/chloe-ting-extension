var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebRTCClient } from './WebRTCClient';
const MAX_RETRY = 5;
const RETRY_WAIT_TIME = 500;
function wait(delay) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    });
}
class AudioContextManager {
    constructor(options) {
        this.peerReceiver = null;
        this.stream = null;
        this.store = options.store;
    }
    getAudioStream(selectedTabId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Set up WebRTC peer to receiver audio from tab', selectedTabId);
            this.peerReceiver = new WebRTCClient();
            chrome.tabs.executeScript(selectedTabId, {
                file: 'getAudioViaWebRTC.js'
            });
            let attempt = 1;
            while (!this.stream) {
                if (attempt > MAX_RETRY) {
                    throw new Error('Unable to get audio stream');
                }
                attempt += 1;
                yield wait(RETRY_WAIT_TIME);
                // NOTE TIN: In case when calling stopStream() while getAudioStream is executing
                // this.peerReceiver could already been set to null
                if (this.peerReceiver) {
                    this.stream = this.peerReceiver.getStream();
                }
            }
            console.log('Got audio stream');
            return this.stream;
        });
    }
    stopStream() {
        if (this.peerReceiver) {
            this.peerReceiver.closeConnection();
        }
        this.peerReceiver = null;
        this.stream = null;
    }
}
export default AudioContextManager;
