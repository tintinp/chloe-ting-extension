import '../../../style/dashboard.css'

import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import CONSTANTS from '../../constants/CONSTANTS'
import PropTypes from 'prop-types'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200
    }
  },
  button: {
    background: '#FFFFFF',
    color: '#707070',
    height: 40,
    width: 120,
    margin: 10,
    border: '1px solid #edebeb',
    'box-shadow': '1px 1px 1px 1px #dbdbdb'
  }
}))

const Tasks = ({ collectingData, handleToggle }) => {
  const style = useStyles()
  const [toggleState, setToggleState] = useState(false)

  return (
    <div>
      <p className="tool-label">Tasks</p>
      <div className="column">
        <Switch
          checked={toggleState}
          onChange={() => {}}
          name="checkedA"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
        <Button id="export-btn" className={style.button} onClick={() => {}}>
          Export CSV
        </Button>
      </div>
    </div>
  )
}

Tasks.propTypes = {
  collectingData: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired
}

export default Tasks
