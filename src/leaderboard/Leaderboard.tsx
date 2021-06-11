import React, { useState, useEffect } from 'react';
import { getJWT, goTo } from "../utils/Utils";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles({
  table: {
    padding: '5px'
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#1caac9',
    color: 'white',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);


interface leaderBoardRecord {
  name: String,
  correct_results: number,
  correct_scores: number,
  score: number
}

export default function LeaderBoard() {
  const classes = useStyles();
  const [isLive, setIsLive] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<leaderBoardRecord[]>([])

  useEffect(() => {
    fetch(goTo('leaderboard'), {
      method: 'GET'
    }).then(res => res.json()).then(res => {
      if (res.success) {
        console.log(res)
        setLeaderboardData(res.leaderboard)
      }
    })

    fetch(goTo('match/in-progress'), {
      method: 'GET',
      headers: {
          'Authenticate': getJWT()
      }
  }).then(res => res.json()).then(res => {
      if (res.success) {
          setIsLive(res.matches.length > 0);
      }
  });
  }, [setLeaderboardData])


  function renderLive() {
    if (isLive) {
      return <FiberManualRecordIcon style={{ color: 'green', paddingRight: '3vw' }} />
    } else {
      return <></>
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>#</StyledTableCell>
            <StyledTableCell>Player</StyledTableCell>
            <StyledTableCell>R</StyledTableCell>
            <StyledTableCell>S</StyledTableCell>
            <StyledTableCell align="center"><b>Pts</b></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboardData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{renderLive()}{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                 {row.name}
              </TableCell>
              <TableCell>{row.correct_results}</TableCell>
              <TableCell>{row.correct_scores}</TableCell>
              <TableCell align="center"><b>{row.score}</b></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}