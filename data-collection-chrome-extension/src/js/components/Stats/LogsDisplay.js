import PropTypes from 'prop-types'
import React from 'react'

const LogsDisplay = ({ logs }) => {
  return (
    <div>
      <p className="tool-label">Log</p>
      <form>
        <textarea disabled={true} className="logs" value={logs}></textarea>
      </form>
    </div>
  )
}

LogsDisplay.propTypes = {
  logs: PropTypes.string.isRequired
}

export default LogsDisplay
