import '../../../style/dashboard.css'

import { keys, map } from 'lodash'

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React from 'react'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: 240,
    marginRight: 25
  },
  noSound: {
    color: '#ff4d55',
    width: 20
  },
  sound: {
    color: '#12e068',
    width: 20
  }
}))

const TabSelector = ({ selectedTab, tabs, activeSignal, handleSelectedTab, collectingData }) => {
  const style = useStyles()

  const generateMenuItem = () => {
    return map(keys(tabs), (id) => {
      const idInt = parseInt(id)
      return (
        <MenuItem key={idInt} value={idInt}>
          {tabs[id]}
        </MenuItem>
      )
    })
  }

  const handleChange = (event) => {
    handleSelectedTab(event.target.value)
  }

  return (
    <div>
      <p className="tool-label">Audio Input</p>
      <div className="row align-left center-level">
        <FormControl variant="outlined" className={style.formControl}>
          <InputLabel id="tab-select-label">Selected tab</InputLabel>
          <Select
            labelId="tab-select-label"
            id="tab-select"
            value={selectedTab ? selectedTab : 'not selected'}
            disabled={collectingData}
            onChange={handleChange}
            label="tab-select"
          >
            <MenuItem value={'not selected'} disabled>
              Select a tab
            </MenuItem>
            {generateMenuItem()}
          </Select>
        </FormControl>
        <FiberManualRecordIcon className={activeSignal ? style.sound : style.noSound} />
      </div>
    </div>
  )
}

TabSelector.propTypes = {
  selectedTab: PropTypes.number,
  tabs: PropTypes.object.isRequired,
  activeSignal: PropTypes.bool.isRequired,
  handleSelectedTab: PropTypes.func.isRequired,
  collectingData: PropTypes.bool.isRequired
}

export default TabSelector
