import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  FormHelperText
} from "@material-ui/core";
import { xor, first, filter, find } from "lodash";
import Checkbox from "./Checkbox";
import Radio from "./Radio";
import Box from "@material-ui/core/Box";
import { useTranslation } from "react-i18next";
import Colors from "../Colors";
import { isEmpty } from "lodash";

export const CodedFormElement = ({
  groupName,
  items,
  isChecked,
  onChange,
  multiSelect,
  mandatory,
  validationResults,
  uuid,
  errorMsg,
  ...props
}) => {
  let genwidth = "";
  if (groupName === "Gender") {
    genwidth = "10%";
  } else {
    genwidth = "20%";
  }
  const { t } = useTranslation();
  const validationResult = find(
    validationResults,
    validationResult => validationResult.formIdentifier === uuid
  );

  const color = item =>
    isChecked(item) && item.abnormal ? Colors.ValidationError : Colors.DefaultPrimary;

  return (
    <FormControl
      component="fieldset"
      {...props}
      style={{ width: "80%", marginBottom: "-20px" }}
      required={mandatory}
      error={(validationResult && !validationResult.success) || !isEmpty(errorMsg)}
    >
      <FormLabel component="legend">{t(groupName)}</FormLabel>
      <FormGroup>
        <Box display="flex" flexWrap="wrap" alignContent="flex-start">
          {items.map(item => (
            <Box width={genwidth}>
              <FormControlLabel
                key={item.uuid}
                control={
                  multiSelect ? (
                    <Checkbox
                      checked={isChecked(item)}
                      onChange={() => onChange(item)}
                      value={item.uuid}
                    />
                  ) : (
                    <Radio
                      checked={isChecked(item)}
                      onChange={() => onChange(first(xor([item], filter(items, isChecked))))}
                      value={item.uuid}
                    />
                  )
                }
                label={t(item.name)}
                style={{ color: color(item) }}
              />{" "}
            </Box>
          ))}
        </Box>
      </FormGroup>
      <FormHelperText>
        {(validationResult && t(validationResult.messageKey, validationResult.extra)) ||
          t(errorMsg)}
      </FormHelperText>
    </FormControl>
  );
};
