import React, { useEffect } from "react";
import ScreenWithAppBar from "../common/components/ScreenWithAppBar";
import api from "./api";
import { DocumentationReducer, initialState } from "./reducers";
import { filter, get, isNil, map } from "lodash";
import DocumentationContext from "./context";
import { Documentation } from "./components/Documentation";
import CustomizedBackdrop from "../dataEntryApp/components/CustomizedBackdrop";
import Box from "@material-ui/core/Box";
import { Item } from "./components/Item";

function createDocumentationNode(
  documentations,
  onDocumentationToggle,
  allDocumentations,
  onDocumentationAdd,
  onRemoveDocumentation,
  level
) {
  return map(documentations, (documentation, idx) => {
    const { uuid, name } = documentation;
    const childrenDocumentations = filter(allDocumentations, ad => uuid === get(ad, "parent.uuid"));
    return (
      <React.Fragment>
        <Item
          name={name}
          onAdd={() => onDocumentationAdd(documentation)}
          onDelete={() => onRemoveDocumentation(uuid)}
          level={level}
        />
        {createDocumentationNode(
          childrenDocumentations,
          onDocumentationToggle,
          allDocumentations,
          onDocumentationAdd,
          onRemoveDocumentation,
          level + 1
        )}
      </React.Fragment>
    );
  });
}

const DocumentationList = ({ history, ...props }) => {
  const [state, dispatch] = React.useReducer(DocumentationReducer, initialState);
  const { documentations, saving } = state;
  const rootNodes = filter(documentations, d => isNil(d.parent));

  useEffect(() => {
    const fetchData = async () => {
      const documentations = await api.getDocumentation();
      const nonVoidedDocumentations = filter(documentations, d => !d.voided);
      const orgConfig = await api.getOrganisationConfig();
      const languages = get(orgConfig, "organisationConfig.languages", []);
      dispatch({
        type: "setData",
        payload: { documentations: nonVoidedDocumentations, languages }
      });
    };
    fetchData();
  }, []);

  const onDocumentationToggle = documentation =>
    dispatch({ type: "toggleDocumentation", payload: documentation });

  const onDocumentationAdd = (parent = null) =>
    dispatch({ type: "newDocumentation", payload: { parent: parent } });

  const onRemoveDocumentation = async uuid => {
    if (window.confirm("Do you really want to delete this documentation?")) {
      dispatch({ type: "saving", payload: true });
      const error = await api.deleteDocumentation(uuid);
      if (error) {
        dispatch({ type: "saving", payload: false });
        alert(error);
      } else {
        dispatch({ type: "delete", payload: { uuid } });
        dispatch({ type: "saving", payload: false });
      }
    }
  };

  return (
    <ScreenWithAppBar appbarTitle={"Documentation"}>
      <DocumentationContext.Provider value={{ state: state, dispatch: dispatch }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Box
            border={1}
            borderColor={"#ddd"}
            p={2}
            bgcolor={"rgba(248,248,248,0.37)"}
            style={{ flex: 0.3, overflowX: "auto" }}
          >
            <Item name={"Documentation"} onAdd={() => onDocumentationAdd()} level={1} />
            {createDocumentationNode(
              rootNodes,
              onDocumentationToggle,
              documentations,
              onDocumentationAdd,
              onRemoveDocumentation,
              1
            )}
          </Box>
          <div style={{ flex: 0.7 }}>
            <Documentation />
          </div>
        </div>
        <CustomizedBackdrop load={!saving} />
      </DocumentationContext.Provider>
    </ScreenWithAppBar>
  );
};

export default DocumentationList;