import {
    IconButton,
    TableFooter,
    TablePagination,
    TableRow,
    Typography,
} from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
    Edit,
    Flag,
    Description,
    KeyboardArrowLeft,
    KeyboardArrowRight,
} from '@material-ui/icons'
import React, { useState, useEffect } from 'react'
import { AddForm } from './innovation-props/add-form'
import { EditForm } from './innovation-props/edit-form'
import { useSession } from 'next-auth/client'
import { DescriptionModal } from './common-props/description-modal'
import Filter from './common-props/filter'
import PropTypes from 'prop-types'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import LastPageIcon from '@material-ui/icons/LastPage'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        boxSizing: `border-box`,
    },
    paper: {
        margin: `${theme.spacing(1)}px auto`,
        padding: `${theme.spacing(1.5)}px`,
        lineHeight: 1.5,
    },
    truncate: {
        display: `block`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: `nowrap`,
    },
    icon: {
        display: `block`,
        fontSize: `2rem`,
        marginLeft: `auto`,
        marginRight: `auto`,
    },
    attached: {
        '& > span': { paddingLeft: `8px` },
        '& > span:first-child': {
            paddingLeft: 0,
        },
    },
}))

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginRight: theme.spacing(2.5),
    },
}))

function TablePaginationActions(props) {
    const classes = useStyles1()
    const theme = useTheme()
    const { count, page, rowsPerPage, onChangePage } = props

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0)
    }

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1)
    }

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1)
    }

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                // disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                // disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </div>
    )
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
}

const DataDisplay = (props) => {
    const [session, loading] = useSession()
    const classes = useStyles()
    const [details, setDetails] = useState(props.data)
    const [filterQuery, setFilterQuery] = useState(null)

    // const [rows, setRows] = useState(props.data);
    // const totalRow = [...rows]
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(15)

    // const emptyRows =
    // 	rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const [addModal, setAddModal] = useState(false)
    const addModalOpen = () => {
        setAddModal(true)
    }
    const handleCloseAddModal = () => {
        setAddModal(false)
    }

    useEffect(() => {
        if (!filterQuery) {
            fetch('/api/innovation/between', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    from: page * rowsPerPage,
                    to: page * rowsPerPage + rowsPerPage,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setDetails(data)
                })
                .catch((err) => console.log(err))
        } else {
            fetch('/api/innovation/range', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    ...filterQuery,
                    from: page * rowsPerPage,
                    to: page * rowsPerPage + rowsPerPage,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data)
                    setDetails(data)
                })
                .catch((err) => console.log(err))
        }

        // setDetails(await response.json());

        console.log('page : ', page)
        console.log('rowperpage : ', rowsPerPage)

        // console.log(response.json());
    }, [page, rowsPerPage, filterQuery])

    const Innovation = ({ detail }) => {
        let openDate = new Date(detail.timestamp)
        let dd = openDate.getDate()
        let mm = openDate.getMonth() + 1
        let yyyy = openDate.getFullYear()
        openDate = dd + '/' + mm + '/' + yyyy

        const [editModal, setEditModal] = useState(false)
        const [descriptionModal, setDescriptionModal] = useState(false)

        const editModalOpen = () => {
            setEditModal(true)
        }

        const handleCloseEditModal = () => {
            setEditModal(false)
        }

        const descModalOpen = () => {
            setDescriptionModal(true)
        }

        const handleCloseDescModal = () => {
            setDescriptionModal(false)
        }

        return (
            <React.Fragment key={detail.id}>
                <Grid item xs={12} sm={8} lg={10}>
                    <Paper
                        className={classes.paper}
                        style={{ minHeight: `50px`, position: `relative` }}
                    >
                        <span className={classes.truncate}>{detail.title}</span>
                        <div className={classes.attached}>
                            {detail.image &&
                                detail.image.map((img, idx) => {
                                    return (
                                        <span
                                            key={idx}
                                            style={{
                                                display: `inline-flex`,
                                                margin: `5px 0 `,
                                            }}
                                        >
                                            <Flag />
                                            <a
                                                href={img.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {img.caption}
                                            </a>
                                        </span>
                                    )
                                })}
                        </div>{' '}
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div>Uploaded By : {detail.email} </div>
                            <div>Updated By: {detail.updatedBy} </div>
                            <div>Open Date: {openDate}</div>
                        </div>
                    </Paper>
                </Grid>

                <Grid item xs={6} sm={2} lg={1}>
                    <Paper
                        className={classes.paper}
                        style={{ textAlign: `center`, cursor: `pointer` }}
                        onClick={descModalOpen}
                    >
                        <Description className={classes.icon} />
                        <span>Description</span>
                    </Paper>
                    <DescriptionModal
                        data={detail}
                        handleClose={handleCloseDescModal}
                        modal={descriptionModal}
                    />
                </Grid>
                {session.user.role == 1 ||
                session.user.email === detail.email ? (
                    <Grid item xs={6} sm={2} lg={1}>
                        <Paper
                            className={classes.paper}
                            style={{ textAlign: `center`, cursor: `pointer` }}
                            onClick={editModalOpen}
                        >
                            <Edit className={classes.icon} /> <span>Edit</span>
                        </Paper>{' '}
                        <EditForm
                            data={detail}
                            modal={editModal}
                            handleClose={handleCloseEditModal}
                        />
                    </Grid>
                ) : (
                    <Grid item xs={6} sm={2} lg={1}>
                        <Paper
                            className={classes.paper}
                            style={{ textAlign: `center`, cursor: `pointer` }}
                        ></Paper>{' '}
                    </Grid>
                )}
            </React.Fragment>
        )
    }

    return (
        <div>
            <header>
                <Typography variant="h4" style={{ margin: `15px 0` }}>
                    Recent Innovations
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={addModalOpen}
                >
                    ADD +
                </Button>
                <Filter type="innovation" setEntries={setFilterQuery} />
            </header>

            <AddForm handleClose={handleCloseAddModal} modal={addModal} />

            <Grid container spacing={2} className={classes.root}>
                {details.map((row) => {
                    return <Innovation detail={row} />
                })}
                {/* <Grid >
            <Paper xs={12} sm={9}>{detail.title}</Paper>
         </Grid> */}
            </Grid>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        rowsPerPageOptions={[15, 25, 50, 100]}
                        colSpan={7}
                        count={rowsPerPage * page + details.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        </div>
    )
}

export default DataDisplay

// Extras
// 	<Grid item xs={4} sm={2} lg={1}>
// 								<Paper
// 									className={classes.paper}
// 									style={{ textAlign: `center` }}
// 								>
// 									{detail.isVisible ? (
// 										<>
// 											<Visibility className={classes.icon} />
// 											{/* <i className="fa fa-eye" style={{ color: "action" }}></i> */}
// 											<span>Visible</span>
// 										</>
// 									) : (
// 										<>
// 											{/* <i
// 												className="fa fa-eye-slash"
// 												style={{ color: "secondary" }}
// 											></i> */}
// 											<VisibilityOff
// 												color="secondary"
// 												className={classes.icon}
// 											/>
// 											<span>Archive</span>
// 										</>
// 									)}
// 								</Paper>
// 							</Grid >
