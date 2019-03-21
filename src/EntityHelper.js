import store from "./store";
import Guid from "guid";

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

export function getRowById(tableDataOrName, id, create = false) {
  // noinspection JSUnresolvedVariable
  const tableData =
    typeof tableDataOrName === "string"
      ? store.state.data[tableDataOrName]
      : tableDataOrName;
  const rows = tableData.filter(row => row.id === id);
  return rows[0] || (create ? createRow(tableDataOrName, { id }) : null);
}

export function isNewRow(row, tableName) {
  return !getRowById(tableName, row.id);
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

export function createRow(tableName, data) {
  // noinspection JSUnresolvedVariable
  const tableSchema = store.state.schema[tableName];
  let row = {};
  // noinspection JSUnresolvedVariable
  for (const fieldName of tableSchema.fields) {
    // noinspection JSUnresolvedVariable
    row[fieldName] = tableSchema.fieldsInfo[fieldName].default;
  }
  if (row.id === null) {
    row.id = Guid.create();
  }
  return {
    ...row,
    ...data
  };
}

export function resolveGuid(id) {
  // noinspection JSUnresolvedVariable
  return store.state.guids[id.toString()] || id;
}
