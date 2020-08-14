import '../../style/app.css'

import React, { Fragment } from 'react'

import Analysis from './Analysis/Analysis'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import MusicReplacer from './MusicReplacer/MusicReplacer'
import PropTypes from 'prop-types'
import YouTubeIcon from '@material-ui/icons/YouTube'
import { withStyles } from '@material-ui/core/styles'

const styles = {
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
}

const App = ({ port, classes }) => {
  const [value, setValue] = React.useState('musicReplacer')

  return (
    <Fragment>
      {value === 'musicReplacer' && <MusicReplacer port={port} />}
      {value === 'analysis' && <Analysis port={port} />}
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          console.log('newValue', newValue)
          setValue(newValue)
        }}
        showLabels
        classes={{ root: classes.navBar }}
      >
        <BottomNavigationAction
          classes={{
            root: classes.navIcon,
            selected: classes.navIconSelected
          }}
          label="Music Replacer"
          value="musicReplacer"
          icon={<YouTubeIcon />}
        />
        <BottomNavigationAction
          classes={{
            root: classes.navIcon,
            selected: classes.navIconSelected
          }}
          label="Analysis"
          value="analysis"
          icon={<GraphicEqIcon />}
        />
      </BottomNavigation>
    </Fragment>
  )
}

App.propTypes = {
  port: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(App)
