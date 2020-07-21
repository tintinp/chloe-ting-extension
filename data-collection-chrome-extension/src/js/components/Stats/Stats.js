import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Stats = ({ dashboardState }) => {
  return <div></div>
}

Stats.propTypes = {
  dashboardStates: PropTypes.object.isRequired
}

const mapStateToProps = ({ dashboardState } = {
  dashboardState: dashboardState
})

export default connect(mapStateToProps)(Stats)
