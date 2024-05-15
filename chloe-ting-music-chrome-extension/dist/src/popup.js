import { jsx as _jsx } from "react/jsx-runtime";
import '../assets/style/popup.css';
import { App } from './components/App';
import { CONSTANTS } from './constants/constants';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';
import { render } from 'react-dom';
const store = new Store();
const port = chrome.runtime.connect({ name: CONSTANTS.PORTS.CROSS_LAYER });
store.ready().then(() => {
    render(_jsx(Provider, { store: store, children: _jsx(App, { port: port }) }), document.getElementById('popup'));
});
