import Vue from "vue";
import store from "./store";

function getDisplayTextByProperty(row, tableName, propertyName) {
  // noinspection JSUnresolvedVariable
  const { fields, fieldsInfo } = store.state.schema[tableName];
  let keyParts = [];
  for (const fieldName of fields) {
    const value = row[fieldName];
    if (value && fieldsInfo[fieldName][propertyName]) {
      keyParts.push(value);
    }
  }
  return keyParts.join(" ");
}

export function getDisplayText(row, tableName) {
  return getDisplayTextByProperty(row, tableName, "displayField");
}

export function getAdditionalInfoText(row, tableName) {
  return getDisplayTextByProperty(row, tableName, "additionalInfoField");
}

export function getRowById(tableData, id) {
  const rows = tableData.filter(row => row.id === id);
  return rows[0] || null;
}

export function getRowsByForeignKey(row, foreignKey, data) {
  // noinspection JSUnresolvedVariable
  return data[foreignKey.tableName].filter(
    foreignRow => foreignRow[foreignKey.fieldName] === row.id
  );
}

export function getForeignTableName(tableName, fieldName) {
  // noinspection JSUnresolvedVariable
  return store.state.schema[tableName].fieldsInfo[fieldName].foreignTable;
}

export function getRowFullId(row, tableData) {
  let fullId = [];
  while (row) {
    fullId.unshift(row.id);
    const { parentId } = row;
    if (!parentId) {
      break;
    }
    row = getRowById(tableData, parentId);
  }
  return fullId;
}

// Checks if "child" is a child of "row" or equals to it
export function isChild(child, row, tableName, data) {
  if (child.id === row.id) {
    return true;
  }
  // noinspection JSUnresolvedVariable
  data = data || store.state.data;
  const rowFullId = getRowFullId(row, data[tableName]).join(">");
  const childFullId = getRowFullId(child, data[tableName]).join(">");
  return childFullId.startsWith(rowFullId);
}

export function cloneRow(row) {
  return Object.assign({}, row);
}

export function resolveGuid(id) {
  console.log("resolving guids", id.toString(), store.state.guids);
  // noinspection JSUnresolvedVariable
  return store.state.guids[id.toString()] || id;
}

Vue.filter("rowsByForeignKey", getRowsByForeignKey);
Vue.filter("displayText", getDisplayText);
Vue.filter("additionalInfoText", getAdditionalInfoText);
