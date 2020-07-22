import '../../../style/dashboard.css'

import Button from '@material-ui/core/Button'
import CONSTANTS from '../../constants/CONSTANTS'
import PropTypes from 'prop-types'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  notSelected: {
    background: '#FFFFFF',
    color: '#707070',
    height: 40,
    width: 90,
    margin: 10,
    border: '1px solid #edebeb',
    'box-shadow': '1px 1px 1px 1px #dbdbdb',
    '&:hover': {
      border: '4px solid #ff3d46',
      background: '#FFFFFF'
    }
  },
  selected: {
    background: '#ff3d46',
    color: '#FFFFFF',
    margin: 10,
    'box-shadow': '1px 1px 1px 1px #dbdbdb',
    '&:hover': {
      border: '4px solid #ff3d46',
      background: '#ff3d46'
    },
    height: 40,
    width: 90
  }
})

const Controls = ({ selectedClass, handleSelectedClass }) => {
  const btn = useStyles()

  const handleClickBtn = (event) => {
    const id = event.currentTarget.id
    if (selectedClass === id) {
      handleSelectedClass(null)
    } else {
      handleSelectedClass(id)
    }
  }

  return (
    <div>
      <p className="tool-label">Class Marking</p>
      <div className="row align-center">
        <Button
          id={CONSTANTS.CHLOE}
          className={selectedClass === CONSTANTS.CHLOE ? btn.selected : btn.notSelected}
          onClick={handleClickBtn}
        >
          Chloe
        </Button>
        <Button
          id={CONSTANTS.BEEP}
          className={selectedClass === CONSTANTS.BEEP ? btn.selected : btn.notSelected}
          onClick={handleClickBtn}
        >
          Beep
        </Button>
        <Button
          id={CONSTANTS.MUSIC}
          className={selectedClass === CONSTANTS.MUSIC ? btn.selected : btn.notSelected}
          onClick={handleClickBtn}
        >
          Music
        </Button>
      </div>
    </div>
  )
}

Controls.propTypes = {
  selectedClass: PropTypes.string,
  handleSelectedClass: PropTypes.func.isRequired
}

export default Controls
