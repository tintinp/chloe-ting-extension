import PropTypes from 'prop-types'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  table: {
    width: 270
  }
})

const StatsDisplay = ({ chloeSampleCount, beepSampleCount, musicSampleCount }) => {
  const style = useStyles()

  return (
    <div>
      <p className="tool-label">Stats</p>
      <Table className={style.table} size="small" aria-label="a dense table">
        <TableBody>
          <TableRow key={'chloe-count'}>
            <TableCell component="th" scope="row">
              {'Chloe Sample Count'}
            </TableCell>
            <TableCell align="right">{chloeSampleCount}</TableCell>
          </TableRow>

          <TableRow key={'beep-count'}>
            <TableCell component="th" scope="row">
              {'Beep Sample Count'}
            </TableCell>
            <TableCell align="right">{beepSampleCount}</TableCell>
          </TableRow>

          <TableRow key={'music-count'}>
            <TableCell component="th" scope="row">
              {'Music Sample Count'}
            </TableCell>
            <TableCell align="right">{musicSampleCount}</TableCell>
          </TableRow>

          <TableRow key={'total-count'}>
            <TableCell component="th" scope="row">
              {'Total Sample Count'}
            </TableCell>
            <TableCell align="right">
              {chloeSampleCount + beepSampleCount + musicSampleCount}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

StatsDisplay.propTypes = {
  chloeSampleCount: PropTypes.number.isRequired,
  beepSampleCount: PropTypes.number.isRequired,
  musicSampleCount: PropTypes.number.isRequired
}

export default StatsDisplay
