import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Controls = ({ dashboardStates }) => {
  return (
    <div>
      <div className="items-in-row">
        <p className="tool-label">Class Marking</p>
        <div className="items-in-col">
          <div className="row">
            <div className="col s4">
              <a id="chloe_btn" className="btn-small class-selector max-width">
                Chloe
              </a>
            </div>
            <div className="col s4">
              <a id="beep_btn" className="btn-small class-selector max-width">
                Beep
              </a>
            </div>
            <div className="col s4">
              <a id="music_btn" className="btn-small class-selector max-width">
                Music
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Controls.propTypes = {
  dashboardStates: PropTypes.object.isRequired
}

const mapStateToProps = ({ dashboardStates }) => ({
  dashboardStates: dashboardStates
})

export default connect(mapStateToProps)(Controls)
