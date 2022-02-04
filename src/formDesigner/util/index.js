import { find, defaultTo } from "lodash";
import { DeclarativeRuleHolder } from "rules-config";

export const findOrDefault = (collection, predicate, defaultValue) => {
  const value = find(collection, predicate);
  return defaultTo(value, defaultValue);
};

export const confirmBeforeRuleEdit = (ruleJson, updateRuleFunc, resetDeclarativeRuleFunc) => {
  const warningMessage =
    "Editing the rule will reset the declarative rule. Are you sure you want to edit it?";
  const declarativeRuleHolder = DeclarativeRuleHolder.fromResource(ruleJson);
  if (declarativeRuleHolder.isEmpty()) {
    updateRuleFunc();
  } else if (window.confirm(warningMessage)) {
    resetDeclarativeRuleFunc();
    updateRuleFunc();
  }
};
