import { keys, map } from 'lodash'

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
    width: '75%',
    marginRight: 25
  }
}))

const TabSelector = ({ selectedTabId, tabs, handleSelectedTabId }) => {
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
    handleSelectedTabId(event.target.value)
  }

  return (
    <div className="row align-left center-level">
      <FormControl variant="outlined" className={style.formControl}>
        <InputLabel id="tab-select-label">Tab</InputLabel>
        <Select
          labelId="tab-select-label"
          id="tab-select"
          value={selectedTabId ? selectedTabId : 'not selected'}
          onChange={handleChange}
          label="tab-select"
        >
          <MenuItem value={'not selected'} disabled>
            Select a tab
          </MenuItem>
          {generateMenuItem()}
        </Select>
      </FormControl>
    </div>
  )
}

TabSelector.propTypes = {
  selectedTabId: PropTypes.number,
  tabs: PropTypes.object.isRequired,
  handleSelectedTabId: PropTypes.func.isRequired
}

export default TabSelector
