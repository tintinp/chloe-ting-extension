import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { keys, map } from 'lodash';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        width: '75%',
        marginRight: 25
    }
}));
export const TabSelector = ({ selectedTabId, tabs, handleSelectedTabId }) => {
    const style = useStyles();
    const generateMenuItem = () => {
        return map(keys(tabs), (id) => {
            const idInt = parseInt(id);
            return (_jsx(MenuItem, { value: idInt, children: tabs[idInt] }, idInt));
        });
    };
    const handleChange = (event) => {
        handleSelectedTabId(event.target.value);
    };
    return (_jsx("div", { className: "row align-left center-level", children: _jsxs(FormControl, { variant: "outlined", className: style.formControl, children: [_jsx(InputLabel, { id: "tab-select-label", children: "Tab" }), _jsxs(Select, { labelId: "tab-select-label", id: "tab-select", value: selectedTabId ? selectedTabId : 'not selected', onChange: handleChange, label: "tab-select", children: [_jsx(MenuItem, { value: 'not selected', disabled: true, children: "Select a tab" }), generateMenuItem()] })] }) }));
};
