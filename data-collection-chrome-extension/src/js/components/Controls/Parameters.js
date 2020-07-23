import CONSTANTS from '../../constants/CONSTANTS'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200
    }
  }
}))

const Parameters = ({ collectingData, handleChangeSampleLength }) => {
  const style = useStyles()

  const handleChange = (event) => {
    handleChangeSampleLength(parseFloat(event.target.value))
  }

  return (
    <div>
      <p className="tool-label">Parameters</p>
      <div className="row align-left center-level">
        <form className={style.root} autoComplete="off">
          <TextField
            disabled={collectingData}
            id="sample=length"
            label="Sample Length (ms)"
            type="number"
            variant="outlined"
            defaultValue={CONSTANTS.DEFAULT_SAMPLE_LENGTH}
            onChange={handleChange}
            required
          />
        </form>
      </div>
    </div>
  )
}

Parameters.propTypes = {
  collectingData: PropTypes.bool.isRequired,
  handleChangeSampleLength: PropTypes.func.isRequired
}

export default Parameters