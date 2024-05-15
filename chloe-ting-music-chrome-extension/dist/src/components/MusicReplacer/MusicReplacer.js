import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FormControlLabel, FormGroup, Paper, Switch, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { setMusicTab, setWorkoutTab, toggleStartStop } from '../../redux/actions';
import { CONSTANTS } from '../../constants/constants';
import { TabSelector } from './TabSelector';
import { connect } from 'react-redux';
import { isNumber } from 'lodash';
const useStyles = makeStyles(() => ({
    root: {
        padding: 10
    },
    formGroup: {
        paddingLeft: 12
    },
    paper: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        background: 'white',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        height: 460
    }
}));
const musicReplacer = ({ setWorkoutTab, setMusicTab, handleToggle, appState, port }) => {
    const style = useStyles();
    const [canStart, setCanStart] = useState(false);
    const { selectedTabId, toggleOn, tabs } = appState;
    useEffect(() => {
        if (isNumber(selectedTabId.workout) && isNumber(selectedTabId.music)) {
            setCanStart(true);
        }
        else {
            setCanStart(false);
        }
    }, [selectedTabId]);
    const onToggle = () => {
        if (toggleOn) {
            port.postMessage({ type: CONSTANTS.EVENTS.STOP_PREDICTING });
        }
        else {
            port.postMessage({
                type: CONSTANTS.EVENTS.START_PREDICTING,
                payload: { selectedTabId }
            });
        }
        handleToggle();
    };
    return (_jsxs(Paper, { className: style.paper, children: [_jsxs("div", { children: [_jsx("p", { className: "label", children: "Workout Video Tab" }), _jsx(TabSelector, { selectedTabId: selectedTabId.workout, tabs: tabs, handleSelectedTabId: setWorkoutTab })] }), _jsxs("div", { children: [_jsx("p", { className: "label", children: "Music Tab" }), _jsx(TabSelector, { selectedTabId: selectedTabId.music, tabs: tabs, handleSelectedTabId: setMusicTab })] }), _jsx(FormGroup, { "aria-label": "position", row: true, className: style.formGroup, children: _jsx(FormControlLabel, { value: "start", control: _jsx(Switch, { disabled: !canStart, checked: toggleOn, onChange: onToggle, name: "onoff-switch", inputProps: { 'aria-label': 'secondary checkbox' } }), label: "On/Off", labelPlacement: "end" }) })] }));
};
const mapStateToProps = ({ appState }) => {
    console.log('appstate', appState);
    return {
        appState: appState
    };
};
const mapDispatchToProps = (dispatch) => ({
    setWorkoutTab: (selectedTabId) => dispatch(setWorkoutTab(selectedTabId)),
    setMusicTab: (selectedTabId) => dispatch(setMusicTab(selectedTabId)),
    handleToggle: () => dispatch(toggleStartStop())
});
export const MusicReplacer = connect(mapStateToProps, mapDispatchToProps)(musicReplacer);
