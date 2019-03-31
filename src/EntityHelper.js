import { getTableSchema, getTableData, getGuids } from "./storeProxy";
import Guid from "guid";
import EntityTransitionsList from "./EntityTransitionsList";

export function getTableFieldsArray(tableName) {
  // noinspection JSUnresolvedVariable
  return getTableSchema(tableName).fields;
}

export function getTableFieldInfo(tableName, fieldName) {
  // noinspection JSUnresolvedVariable
  return getTableSchema(tableName).fieldsInfo[fieldName];
}

export function walkTableFields(tableName, callback) {
  for (const fieldName of getTableFieldsArray(tableName)) {
    callback(fieldName, getTableFieldInfo(tableName, fieldName));
  }
}

export function walkTableRowFields(tableName, row, callback) {
  walkTableFields(tableName, (fieldName, fieldInfo) => {
    callback(fieldName, row[fieldName], fieldInfo);
  });
}

function getDisplayTextByProperty(row, tableName, propertyName) {
  let keyParts = [];
  walkTableRowFields(tableName, row, (fieldName, value, fieldInfo) => {
    if (value && fieldInfo[propertyName]) {
      keyParts.push(value);
    }
  });
  return keyParts.join(" ");
}

export function getDisplayText(row, tableName) {
  return getDisplayTextByProperty(row, tableName, "displayField");
}

export function getAdditionalInfoText(row, tableName) {
  return getDisplayTextByProperty(row, tableName, "additionalInfoField");
}

export function getRowById(tableDataOrName, id, create = false) {
  const tableData =
    typeof tableDataOrName === "string"
      ? getTableData(tableDataOrName)
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
  return getTableFieldInfo(tableName, fieldName).foreignTable;
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

export function getRowFullName(row, tableName, tableData = null) {
  tableData = tableData || getTableData(tableName);
  let fullName = [];
  while (row) {
    fullName.unshift(getDisplayText(row, tableName));
    const { parentId } = row;
    if (!parentId) {
      break;
    }
    row = getRowById(tableData, parentId);
  }
  return fullName;
}

// Checks if "child" is a child of "row" or equals to it
export function isChild(child, row, tableDataOrName) {
  if (child.id === row.id) {
    return true;
  }
  const tableData =
    typeof tableDataOrName === "string"
      ? getTableData(tableDataOrName)
      : tableDataOrName;
  const rowFullId = getRowFullId(row, tableData).join(">");
  const childFullId = getRowFullId(child, tableData).join(">");
  return childFullId.startsWith(rowFullId);
}

export function cloneRow(row) {
  return Object.assign({}, row);
}

export function createRow(tableName, data) {
  let row = {};
  walkTableFields(tableName, (fieldName, fieldInfo) => {
    row[fieldName] = fieldInfo.default;
  });
  if (row.id === null) {
    row.id = Guid.create();
  }
  return {
    ...row,
    ...data
  };
}

export function addRow(tableName, row) {
  let transitionsList = new EntityTransitionsList();
  row.id = row.id || Guid.create();
  return transitionsList.addRow(tableName, row).save();
}

export function updateRow(tableName, id, updates) {
  return new EntityTransitionsList().updateRow(tableName, id, updates).save();
}

export function deleteRow(tableName, row) {
  return new EntityTransitionsList().deleteRow(tableName, row).save();
}

export function resolveGuid(id) {
  return getGuids()[id.toString()] || id;
}
