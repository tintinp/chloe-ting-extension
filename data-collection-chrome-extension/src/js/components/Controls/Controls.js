import {
  setSampleLength,
  setSelectedClass,
  setSelectedTab,
  toggleStartStop
} from '../../redux/actions'

import ClassSelector from './ClassSelector'
import Grid from '@material-ui/core/Grid'
import Parameters from './Parameters'
import PropTypes from 'prop-types'
import React from 'react'
import TabSelector from './TabSelector'
import Tasks from './Tasks'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  root: {
    padding: 10
  }
}))

const Controls = ({
  dashboardStates,
  handleSelectedClass,
  handleSelectedTab,
  handleToggle,
  handleChangeSampleLength
}) => {
  const style = useStyles()
  return (
    <div>
      <Grid className={style.grid} container spacing={2}>
        <Grid item xs={12}>
          <ClassSelector
            selectedClass={dashboardStates.selectedClass}
            handleSelectedClass={handleSelectedClass}
          />
        </Grid>
        <Grid item xs={12}>
          <TabSelector
            selectedTab={dashboardStates.selectedTab}
            tabs={dashboardStates.tabs}
            activeSignal={dashboardStates.activeSignal}
            handleSelectedTab={handleSelectedTab}
            collectingData={dashboardStates.collectingData}
          />
        </Grid>
        <Grid item xs={12}>
          <Parameters
            handleChangeSampleLength={handleChangeSampleLength}
            collectingData={dashboardStates.collectingData}
          />
        </Grid>
        <Grid item xs={12}>
          <Tasks
            collectingData={dashboardStates.collectingData}
            handleToggle={handleToggle}
            sampleLength={dashboardStates.sampleLength}
            selectedTab={dashboardStates.selectedTab}
          />
        </Grid>
      </Grid>
    </div>
  )
}

Controls.propTypes = {
  dashboardStates: PropTypes.object.isRequired
}

const mapStateToProps = ({ dashboardStates }) => ({
  dashboardStates: dashboardStates
})

const mapDispatchToProps = (dispatch) => ({
  handleSelectedClass: (selectedClass) => dispatch(setSelectedClass(selectedClass)),
  handleSelectedTab: (selectedTab) => dispatch(setSelectedTab(selectedTab)),
  handleToggle: () => dispatch(toggleStartStop()),
  handleChangeSampleLength: (sampleLength) => dispatch(setSampleLength(sampleLength))
})
export default connect(mapStateToProps, mapDispatchToProps)(Controls)
