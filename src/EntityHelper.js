import { getTableSchema, getTableData, getGuids } from "./storeProxy";
import { EntityRow } from "./EntityRow";

export function getTableFieldsArray(tableName) {
  // noinspection JSUnresolvedVariable
  return getTableSchema(tableName).fields;
}

export function getTableFieldInfo(tableName, fieldName) {
  // noinspection JSUnresolvedVariable
  return getTableSchema(tableName).fieldsInfo[fieldName];
}

export function getForeignFieldName(tableName, foreignTableName) {
  // noinspection JSUnresolvedVariable
  return getTableSchema(tableName).foreignKeys[foreignTableName];
}

export function getRowById(tableDataOrName, id) {
  return getTableData(tableDataOrName).filter(row => row.id === id)[0] || null;
}

export function getOrCreateRowById(tableName, id) {
  return getRowById(tableName, id) || new EntityRow(tableName, { id }, true);
}

export function getForeignTableName(tableName, fieldName) {
  // noinspection JSUnresolvedVariable
  return getTableFieldInfo(tableName, fieldName).foreignTable;
}

export function resolveGuid(id) {
  return getGuids()[id.toString()] || id;
}
