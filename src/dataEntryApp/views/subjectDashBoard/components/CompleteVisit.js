import React, { Fragment, useEffect } from "react";
import {
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  List
} from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { withRouter, Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { withParams } from "../../../../common/components/utils";
import { getCompletedVisit, getVisitTypes } from "../../../reducers/completedVisitReducer";
import { mapObservation } from "../../../../common/subjectModelMapper";
import Observations from "../../../../common/components/Observations";
import { useTranslation } from "react-i18next";
// import Breadcrumbs from "dataEntryApp/components/Breadcrumbs";
import FilterResult from "../components/FilterResult";
import { enableReadOnly } from "common/constants";
import moment from "moment/moment";

const useStyle = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 1000,
    boxShadow: "0px 0px 3px 0px rgba(0,0,0,0.3)",
    borderRadius: "3px"
  },
  completedVsits: {
    fontWeight: "550",
    fontSize: "21px"
  },
  resultFound: {
    fontWeight: "500"
  },
  tableheader: {
    color: "rgba(0, 0, 0, 4.54)",
    fontSize: "0.75rem",
    fontWeight: "530"
  },
  searchCreateToolbar: {
    display: "flex"
  },
  searchForm: {
    marginLeft: theme.spacing(3),
    marginBottom: theme.spacing(8),
    display: "flex",
    alignItems: "flex-end",
    flex: 8
  },
  searchFormItem: {
    margin: theme.spacing(1)
  },
  searchBtnShadow: {
    boxShadow: "none"
  },
  searchButtonStyle: {
    color: "white",
    cursor: "pointer",
    height: 30,
    padding: "4px 25px",
    fontSize: 12,
    borderRadius: 50
  },
  createButtonHolder: {
    flex: 1
  },
  searchBox: {
    padding: "1.5rem",
    margin: "0rem 1rem"
  },
  cellpadding: {
    padding: "14px 40px 14px 0px"
  },
  Breadcrumbs: {
    margin: "12px 24px",
    fontSize: "12px"
  },
  Typography: {
    fontSize: "12px"
  }
}));

function Row(props) {
  const { t } = useTranslation();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyle();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {t(row.name)}
        </TableCell>
        <TableCell align="left">{row.encounterDateTime}</TableCell>
        <TableCell align="left">{row.earliestVisitDateTime}</TableCell>
        {!enableReadOnly ? (
          <TableCell align="left">
            {" "}
            <Link to="">{t("edit")}</Link> | <Link to="">{t("visit")}</Link>
          </TableCell>
        ) : (
          ""
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                {t("summary")}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  <List>
                    <Observations observations={row.observations ? row.observations : ""} />
                  </List>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const SubjectsTable = ({ allVisits }) => {
  const classes = useStyle();
  const { t } = useTranslation();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  let allVisitsListObj = [];

  if (allVisits) {
    allVisits.content.forEach(function(a) {
      let sub = {
        name: a.encounterType.name ? a.encounterType.name : "-",
        earliestVisitDateTime: a.earliestVisitDateTime
          ? moment(new Date(a.earliestVisitDateTime)).format("DD-MM-YYYY")
          : moment(new Date(a.encounterDateTime)).format("DD-MM-YYYY"),
        encounterDateTime: a.encounterDateTime
          ? moment(new Date(a.encounterDateTime)).format("DD-MM-YYYY")
          : "-",
        observations: mapObservation(a.observations)
      };
      allVisitsListObj.push(sub);
    });
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return allVisitsListObj ? (
    <div>
      <Table
        className={classes.table}
        aria-labelledby="tableTitle"
        size={dense ? "small" : "medium"}
        aria-label="enhanced table"
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.tableheader}>Visit Name</TableCell>
            <TableCell align="left" className={classes.tableheader}>
              Visit Completed Date
            </TableCell>
            <TableCell align="left" className={classes.tableheader}>
              Visit Scheduled Date
            </TableCell>
            {!enableReadOnly ? (
              <TableCell align="left" className={classes.tableheader}>
                Action
              </TableCell>
            ) : (
              ""
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {allVisitsListObj && allVisitsListObj.map(row => <Row key={row.name} row={row} />)}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={allVisitsListObj.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  ) : (
    ""
  );
};

const CompleteVisit = ({ match, getCompletedVisit, getVisitTypes, completedVisit, visitTypes }) => {
  const classes = useStyle();
  const { t } = useTranslation();
  const history = useHistory();
  let localSavedEnrollment;

  if (sessionStorage.getItem("enrollment")) {
    localSavedEnrollment = JSON.parse(sessionStorage.getItem("enrollment"));
  }
  console.log("completed vist localSavedSubject--->", localSavedEnrollment);

  useEffect(() => {
    getCompletedVisit(localSavedEnrollment.enrollmentId);
    getVisitTypes(localSavedEnrollment.enrollmentUuid);
  }, []);

  return completedVisit && visitTypes ? (
    <div>
      <Fragment>
        {/* <Breadcrumbs path={match.path} /> */}
        {/* {paperInfo} */}

        <Breadcrumbs aria-label="breadcrumb" className={classes.Breadcrumbs}>
          <Link color="inherit" onClick={() => history.push("/app")}>
            app
          </Link>
          <Link color="inherit" onClick={() => history.push("/app/subject")}>
            subject
          </Link>
          <Typography color="textPrimary" className={classes.Typography}>
            completeVisit
          </Typography>
        </Breadcrumbs>

        <Paper className={classes.searchBox}>
          <Grid container spacing={3}>
            <Grid item xs={6} alignItems="left">
              <div align="left">
                {/* <h1>Completed visits </h1> */}
                <Typography variant="h6" gutterBottom className={classes.completedVsits}>
                  Completed visits
                </Typography>
                {/* <h5>20 Results found</h5> */}
                <Typography variant="subtitle1" gutterBottom className={classes.resultFound}>
                  {completedVisit ? completedVisit.content.length : ""} Results found
                </Typography>
              </div>
            </Grid>
            <Grid item xs={6} container direction="row" justify="flex-end" alignItems="flex-start">
              <FilterResult visitTypes={visitTypes} />
            </Grid>
          </Grid>
          <SubjectsTable allVisits={completedVisit} />
        </Paper>
      </Fragment>
    </div>
  ) : (
    ""
  );
};

const mapStateToProps = state => {
  return {
    completedVisit: state.dataEntry.completedVisitReducer.completedVisits,
    visitTypes: state.dataEntry.completedVisitReducer.visitTypes
  };
};

const mapDispatchToProps = {
  getCompletedVisit,
  getVisitTypes
};

export default withRouter(
  withParams(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CompleteVisit)
  )
);
