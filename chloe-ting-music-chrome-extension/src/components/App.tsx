import '../../assets/style/app.css'

import React, { FC, Fragment } from 'react'
import { createStyles, withStyles } from '@material-ui/core/styles'

import { Analysis } from './Analysis/Analysis'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import GraphicEqIcon from '@material-ui/icons/GraphicEq'
import { MusicReplacer } from './MusicReplacer/MusicReplacer'
import YouTubeIcon from '@material-ui/icons/YouTube'

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
})

interface AppProps {
  port: chrome.runtime.Port
  classes: Record<any, any>
}

const app: FC<AppProps> = ({ port, classes }) => {
  const [value, setValue] = React.useState('musicReplacer')

  return (
    <Fragment>
      {value === 'musicReplacer' && <MusicReplacer port={port} />}
      {value === 'analysis' && <Analysis port={port} />}
      <BottomNavigation
        value={value}
        onChange={(_event, newValue) => {
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

export const App = withStyles(styles)(app)
