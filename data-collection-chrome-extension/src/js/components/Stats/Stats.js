import Grid from '@material-ui/core/Grid'
import LogsDisplay from './LogsDisplay'
import PropTypes from 'prop-types'
import React from 'react'
import StatsDisplay from './StatsDisplay'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    padding: 10
  }
}))

const Stats = ({ statsStates }) => {
  const style = useStyles()
  return (
    <div>
      <Grid className={style.grid} container spacing={2}>
        <Grid item xs={12}>
          <StatsDisplay
            chloeSampleCount={statsStates.chloeSampleCount}
            beepSampleCount={statsStates.beepSampleCount}
            musicSampleCount={statsStates.musicSampleCount}
          />
        </Grid>
        <Grid item xs={12}>
          <LogsDisplay logs={statsStates.logs} />
        </Grid>
      </Grid>
    </div>
  )
}

Stats.propTypes = {
  statsStates: PropTypes.object.isRequired
}

const mapStateToProps = ({ statsStates }) => ({
  statsStates: statsStates
})

export default connect(mapStateToProps)(Stats)
