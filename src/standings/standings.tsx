import {
    Container,
    createMuiTheme,
    makeStyles,
    Table,
    TableBody,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    TableCell,
} from "@material-ui/core"
import { ReactFragment, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import Header from "../misc/Header"
import { capitalizeFirstLetter, getJWT, resolveEndpoint } from "../utils/Utils"
import { LinearProgress } from "@mui/material"
import React from "react"

export const fontTheme = createMuiTheme({
    typography: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
    },
})

interface userDataInLeague {
  familyName: string;
  userId: string;
  leagueIds: string[];
  givenName: string;
  totalPoints: number;
  rank: number;
}

interface getLeagueData {
  leagueId: string;
  leagueName: string;
  users: userDataInLeague[];
}

const useStyles = makeStyles({
    heading: {
        marginTop: "1.75rem",
        paddingTop: "1rem",
        fontSize: "2rem",
        paddingBottom: "1rem",
    },
    subHeading: {
        fontSize: "1.5rem",
    },
    standings: {
        position: "relative",
        left: 0,
        width: "100%",
    },
    leagueContainer: {
        paddingTop: "1rem",
    },
    leagueTopDiv: {
        content: "",
        position: "absolute",
        top: "100%",
        marginTop: "1.5rem",
        marginLeft: "2.5%",
        marginRight: "2.5%",
        left: "0",
        width: "95%",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        borderRadius: "2vw",
    },
    table: {
        marginBottom: "2rem",
    },
})

export const Standings = (): JSX.Element => {
    const classes = useStyles()
    const [leagueData, setLeagueData] = useState<getLeagueData | undefined>(
        undefined
    )
    const [isLoading, setIsLoading] = useState(false)
    const search = new URLSearchParams(useLocation().search)
    const leagueId = search.get("leagueId")
    const leagueName = leagueData === undefined ? "" : leagueData.leagueName

    useEffect(() => {
        setIsLoading(true)
        fetch(resolveEndpoint("league/get"), {
            method: "POST",
            headers: {
                Authorization: getJWT(),
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                leagueId: leagueId,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    return null
                }
                return res.json()
            })
            .then((res) => {
                setIsLoading(false)
                if (res !== null) {
                    setLeagueData(res.data)
                }
            })
    }, [leagueId])

    function getRows(): ReactFragment {
        if (leagueData === undefined) {
            return []
        }
        return leagueData.users.sort((a, b) => a.rank - b.rank).map((user) => {
            return (
                <TableRow key={user.userId}>
                    <TableCell>{leagueData.users.filter((u) => u.rank === user.rank)
                        .length === 1
                        ? user.rank
                        : "=" + user.rank}</TableCell>
                    <TableCell style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}>
                        {capitalizeFirstLetter(user.givenName)}{" "}
                        {capitalizeFirstLetter(user.familyName)}
                    </TableCell>
                    <TableCell>{user.totalPoints}</TableCell>
                </TableRow>
            )
        })
    }

    return (
        <>
            <Header />
            <Toolbar />
            <Container className={classes.standings} maxWidth="xs">

                <Container>
                    <Typography className={classes.heading}>Standings</Typography>
                    <Typography className={classes.subHeading}>
              League - {leagueName}
                    </Typography>
                </Container>
                <Container className={classes.leagueTopDiv}>
                    <Container className={classes.leagueContainer}>
                        <Container className={classes.table}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Rank</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Name</b>
                                        </TableCell>
                                        <TableCell>
                                            <b>Score</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading && (
                                        <TableRow>
                                            <TableCell colSpan={3}>
                                                <LinearProgress color="inherit" />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!isLoading && getRows()}
                                </TableBody>
                            </Table>
                        </Container>
                    </Container>
                </Container>
            </Container>
        </>
    )
}
