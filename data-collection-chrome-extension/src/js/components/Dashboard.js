import '../../style/dashboard.css'

import Controls from './Controls/Controls'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import LaunchIcon from '@material-ui/icons/Launch'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Stats from './Stats/Stats'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    padding: 10
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
}))
const Dashboard = ({ port }) => {
  const classes = useStyles()

  const onClickHandler = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL('popup.html'),
      type: 'popup',
      focused: true,
      height: 650,
      width: 800
    })
    window.close()
  }

  return (
    <div className={classes.root}>
      <div className="row space-between center-level">
        <div className="header">Chloe Ting Data Collection</div>
        <IconButton>
          <LaunchIcon onClick={onClickHandler} />
        </IconButton>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Controls port={port} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Stats />
          </Paper>
        </Grid>
        <Grid item xs={6}></Grid>
      </Grid>
    </div>
  )
}

Dashboard.propTypes = {
  port: PropTypes.object.isRequired
}

export default Dashboard
