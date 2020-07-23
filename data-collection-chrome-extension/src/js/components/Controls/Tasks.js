import React, { useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import CONSTANTS from '../../constants/CONSTANTS'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import { isNumber } from 'lodash'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  formGroup: {
    paddingLeft: 12
  },
  button: {
    background: '#ff3d46',
    color: '#ffffff',
    height: 40,
    width: 120,
    margin: 10,
    border: '1px solid #c4252d',
    'box-shadow': '1px 1px 1px 1px #c4252d',
    '&:hover': {
      border: '4px solid #c4252d',
      background: '#ff3d46'
    }
  },
  buttonDisabled: {
    background: '#ffffff',
    color: '#707070',
    height: 40,
    width: 120,
    margin: 10,
    border: '1px solid #edebeb',
    'box-shadow': '1px 1px 1px 1px #edebeb'
  }
}))

const Tasks = ({ collectingData, handleToggle, sampleLength, selectedTabId, port }) => {
  const style = useStyles()
  const [canStart, setCanStart] = useState(false)

  useEffect(() => {
    if (isNumber(sampleLength) && isNumber(selectedTabId)) {
      setCanStart(true)
    } else {
      setCanStart(false)
    }
  }, [sampleLength, selectedTabId])

  const onToggle = () => {
    if (collectingData) {
      port.postMessage({ type: CONSTANTS.EVENTS.STOP_COLLECTING_DATA })
    } else {
      port.postMessage({
        type: CONSTANTS.EVENTS.START_COLLECTING_DATA,
        payload: { selectedTabId }
      })
    }
    handleToggle()
  }

  return (
    <div>
      <p className="tool-label">Tasks</p>
      <div className="column">
        <FormGroup aria-label="position" row className={style.formGroup}>
          <FormControlLabel
            value="start"
            control={
              <Switch
                disabled={!canStart}
                checked={collectingData}
                onChange={onToggle}
                name="onoff-switch"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            }
            label="On/Off"
            labelPlacement="end"
          />
        </FormGroup>

        <Button
          disabled={collectingData}
          id="export-btn"
          className={collectingData ? style.buttonDisabled : style.button}
          onClick={() => {}}
        >
          Export CSV
        </Button>
      </div>
    </div>
  )
}

Tasks.propTypes = {
  collectingData: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  sampleLength: PropTypes.any,
  selectedTabId: PropTypes.any,
  port: PropTypes.object.isRequired
}

export default Tasks
