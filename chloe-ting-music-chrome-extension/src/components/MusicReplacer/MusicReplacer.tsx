import { FormControlLabel, FormGroup, Paper, Switch, makeStyles } from '@material-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { UIAction, setMusicTab, setWorkoutTab, toggleStartStop } from '../../redux/actions'

import { AppState } from '../../redux/reducers'
import { CONSTANTS } from '../../constants/constants'
import { Dispatch } from 'redux'
import { TabSelector } from './TabSelector'
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

interface MusicReplacerProps {
  setWorkoutTab: (id: unknown) => UIAction
  setMusicTab: (id: unknown) => UIAction
  handleToggle: () => UIAction
  appState: AppState
  port: chrome.runtime.Port
}

const musicReplacer: FC<MusicReplacerProps> = ({
  setWorkoutTab,
  setMusicTab,
  handleToggle,
  appState,
  port
}) => {
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

const mapStateToProps = ({ appState }: { appState: AppState }) => {
  console.log('appstate', appState)
  return {
    appState: appState
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setWorkoutTab: (selectedTabId: unknown) => dispatch(setWorkoutTab(selectedTabId)),
  setMusicTab: (selectedTabId: unknown) => dispatch(setMusicTab(selectedTabId)),
  handleToggle: () => dispatch(toggleStartStop())
})

export const MusicReplacer = connect(mapStateToProps, mapDispatchToProps)(musicReplacer)
