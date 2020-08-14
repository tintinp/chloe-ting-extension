import { FormControlLabel, FormGroup, Paper, Switch, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { setMusicTab, setWorkoutTab, toggleStartStop } from '../../redux/actions'

import CONSTANTS from '../../constants/CONSTANTS'
import PropTypes from 'prop-types'
import TabSelector from './TabSelector'
import { connect } from 'react-redux'
import { isNumber } from 'lodash'

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
}))

const MusicReplacer = ({ setWorkoutTab, setMusicTab, handleToggle, appState, port }) => {
  const style = useStyles()
  const [canStart, setCanStart] = useState(false)
  const { selectedTabId, toggleOn, tabs } = appState

  useEffect(() => {
    if (isNumber(selectedTabId.workout) && isNumber(selectedTabId.music)) {
      setCanStart(true)
    } else {
      setCanStart(false)
    }
  }, [selectedTabId])

  const onToggle = () => {
    if (toggleOn) {
      port.postMessage({ type: CONSTANTS.EVENTS.STOP_PREDICTING })
    } else {
      port.postMessage({
        type: CONSTANTS.EVENTS.START_PREDICTING,
        payload: { selectedTabId }
      })
    }
    handleToggle()
  }
  return (
    <Paper className={style.paper}>
      <div>
        <p className="label">Workout Video Tab</p>
        <TabSelector
          selectedTabId={selectedTabId.workout}
          tabs={tabs}
          handleSelectedTabId={setWorkoutTab}
        />
      </div>
      <div>
        <p className="label">Music Tab</p>
        <TabSelector
          selectedTabId={selectedTabId.music}
          tabs={tabs}
          handleSelectedTabId={setMusicTab}
        />
      </div>
      <FormGroup aria-label="position" row className={style.formGroup}>
        <FormControlLabel
          value="start"
          control={
            <Switch
              disabled={!canStart}
              checked={toggleOn}
              onChange={onToggle}
              name="onoff-switch"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          }
          label="On/Off"
          labelPlacement="end"
        />
      </FormGroup>
    </Paper>
  )
}

MusicReplacer.propTypes = {
  appState: PropTypes.object.isRequired,
  port: PropTypes.object.isRequired
}

const mapStateToProps = ({ appState }) => ({
  appState: appState
})

const mapDispatchToProps = (dispatch) => ({
  setWorkoutTab: (selectedTabId) => dispatch(setWorkoutTab(selectedTabId)),
  setMusicTab: (selectedTabId) => dispatch(setMusicTab(selectedTabId)),
  handleToggle: () => dispatch(toggleStartStop())
})
export default connect(mapStateToProps, mapDispatchToProps)(MusicReplacer)
