import React, { Fragment } from "react";
import MaterialTable from "material-table";
import http from "common/utils/httpClient";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

const NewSubjectSearchTable = () => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("name"),
      field: "firstName",
      defaultSort: "asc",
      render: rowData => <a href={`/#/app/subject?uuid=${rowData.uuid}`}>{rowData.fullName}</a>
    },
    {
      title: t("subjectType"),
      field: "subjectType.name",
      render: row => row.subjectType && t(row.subjectType.name)
    },
    { title: t("gender"), field: "gender.name", render: row => row.gender && t(row.gender.name) },
    {
      title: t("age"),
      field: "dateOfBirth",
      render: row =>
        row.dateOfBirth
          ? `${new Date().getFullYear() - new Date(row.dateOfBirth).getFullYear()} ${t("years")}`
          : ""
    },
    {
      title: t("Address"),
      field: "addressLevel.title",
      render: row => row.addressLevel.titleLineage
    },
    {
      title: t("enrolments"),
      field: "activePrograms",
      sorting: false,
      render: row => {
        return row.activePrograms.map((p, key) => (
          <Button
            key={key}
            size="small"
            style={{
              height: 20,
              paddingTop: "2px",
              margin: 2,
              backgroundColor: p.colour,
              color: "white",
              fontSize: 11
            }}
            disabled
          >
            {t(p.operationalProgramName)}
          </Button>
        ));
      }
    }
  ];

  const tableRef = React.createRef();
  const refreshTable = ref => ref.current && ref.current.onQueryChange();

  const fetchData = query =>
    new Promise(resolve => {
      let apiUrl = "/individual/search?";
      apiUrl += "size=" + query.pageSize;
      apiUrl += "&page=" + query.page;
      if (!_.isEmpty(query.search)) apiUrl += "&query=" + encodeURIComponent(query.search);
      if (!_.isEmpty(query.orderBy.field))
        apiUrl += `&sort=${query.orderBy.field},${query.orderDirection}`;
      http
        .get(apiUrl)
        .then(response => response.data)
        .then(result => {
          resolve({
            data: result.content,
            page: result.number,
            totalCount: result.totalElements
          });
        })
        .catch(err => console.log(err));
    });

  return (
    <>
      <div className="container">
        <div>
          <MaterialTable
            title=""
            components={{
              Container: props => <Fragment>{props.children}</Fragment>
            }}
            tableRef={tableRef}
            columns={columns}
            data={fetchData}
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 15, 20],
              addRowPosition: "first",
              sorting: true,
              debounceInterval: 500,
              searchFieldAlignment: "left",
              searchFieldStyle: { width: "100%", marginLeft: "-8%" }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NewSubjectSearchTable;