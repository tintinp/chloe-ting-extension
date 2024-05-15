import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../assets/style/app.css';
import React, { Fragment } from 'react';
import { createStyles, withStyles } from '@material-ui/core/styles';
import { Analysis } from './Analysis/Analysis';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import { MusicReplacer } from './MusicReplacer/MusicReplacer';
import YouTubeIcon from '@material-ui/icons/YouTube';
const styles = createStyles({
    navBar: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    navIcon: {
        '&.Mui-selected': {
            color: '#ff3d46'
        }
    },
    navIconSelected: {
        color: '#ff3d46'
    }
});
const app = ({ port, classes }) => {
    const [value, setValue] = React.useState('musicReplacer');
    return (_jsxs(Fragment, { children: [value === 'musicReplacer' && _jsx(MusicReplacer, { port: port }), value === 'analysis' && _jsx(Analysis, { port: port }), _jsxs(BottomNavigation, { value: value, onChange: (_event, newValue) => {
                    console.log('newValue', newValue);
                    setValue(newValue);
                }, showLabels: true, classes: { root: classes.navBar }, children: [_jsx(BottomNavigationAction, { classes: {
                            root: classes.navIcon,
                            selected: classes.navIconSelected
                        }, label: "Music Replacer", value: "musicReplacer", icon: _jsx(YouTubeIcon, {}) }), _jsx(BottomNavigationAction, { classes: {
                            root: classes.navIcon,
                            selected: classes.navIconSelected
                        }, label: "Analysis", value: "analysis", icon: _jsx(GraphicEqIcon, {}) })] })] }));
};
export const App = withStyles(styles)(app);
