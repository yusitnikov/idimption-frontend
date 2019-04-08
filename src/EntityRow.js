import {
  getForeignFieldName,
  getForeignTableName,
  getRowById,
  getTableFieldInfo,
  getTableFieldsArray
} from "./EntityHelper";
import { getTableData } from "./storeProxy";
import Guid from "guid";
import EntityTransitionsList from "./EntityTransitionsList";
import { getUserId } from "./auth";

export class EntityRow {
  tableName;

  constructor(tableName, data, assignDefaultValues = false) {
    this.tableName = tableName;

    if (assignDefaultValues) {
      this.walkFields((fieldName, fieldInfo) => {
        this[fieldName] = fieldInfo.default;
      });

      if (this.userId === null) {
        this.userId = getUserId();
      }
    }

    if (this.id === null) {
      this.id = Guid.create();
    }

    if (this.priority === null) {
      this.priority = this.id;
    }

    this.merge(data);
  }

  getFieldsArray() {
    return getTableFieldsArray(this.tableName);
  }

  getFieldInfo(fieldName) {
    return getTableFieldInfo(this.tableName, fieldName);
  }

  getForeignFieldName(foreignTableName) {
    return getForeignFieldName(this.tableName, foreignTableName);
  }

  getForeignTableName(fieldName) {
    return getForeignTableName(this.tableName, fieldName);
  }

  getTableData() {
    return getTableData(this.tableName);
  }

  getForeignRows(foreignTableName, transitionsList = null) {
    const foreignFieldName = this.getForeignFieldName(foreignTableName);
    const foreignTableData = transitionsList
      ? transitionsList.getTableData(foreignTableName)
      : getTableData(foreignTableName);
    return foreignTableData.getRowsByFieldValue(foreignFieldName, this.id);
  }

  getForeignIds(foreignTableName, foreignFieldName, transitionsList = null) {
    return this.getForeignRows(
      foreignTableName,
      transitionsList
    ).getFieldValues(foreignFieldName);
  }

  walkFields(callback) {
    for (const fieldName of this.getFieldsArray()) {
      callback(fieldName, this.getFieldInfo(fieldName));
    }
  }

  walkValues(data, callback) {
    if (!callback) {
      callback = data;
      data = this;
    }

    this.walkFields((fieldName, fieldInfo) => {
      if (fieldName in data) {
        callback(fieldName, data[fieldName], fieldInfo);
      }
    });
  }

  getData() {
    let data = {};
    this.walkValues((fieldName, value) => {
      data[fieldName] = value;
    });
    return data;
  }

  getParent(tableData = null) {
    tableData = tableData || this.getTableData();
    const { parentId } = this;
    return parentId ? tableData.getRowById(parentId) : null;
  }

  getRowFullId(tableData = null) {
    tableData = tableData || this.getTableData();
    let fullId = [];
    for (let row = this; row; row = row.getParent(tableData)) {
      fullId.unshift(row.id);
    }
    return fullId;
  }

  // Checks if this is a child of "row" or equals to it
  isChild(row, tableData = null) {
    if (row instanceof Array) {
      return row.some(item => this.isChild(item));
    }
    if (this.id === row.id) {
      return true;
    }
    const rowFullId = row.getRowFullId(tableData).join(">");
    const thisFullId = this.getRowFullId(tableData).join(">");
    return thisFullId.startsWith(rowFullId);
  }

  getFullName(tableData = null) {
    tableData = tableData || this.getTableData();
    let fullName = [];
    for (let row = this; row; row = row.getParent(tableData)) {
      fullName.unshift(row.displayText);
    }
    return fullName;
  }

  // not enumerable
  get createdAtDt() {
    // noinspection JSUnresolvedVariable
    return this.createdAt ? new Date(this.createdAt * 1000) : null;
  }

  // not enumerable
  get updatedAtDt() {
    // noinspection JSUnresolvedVariable
    return this.updatedAt ? new Date(this.updatedAt * 1000) : null;
  }

  clone() {
    return new EntityRow(this.tableName, this.getData(), false);
  }

  merge(data) {
    if (data instanceof EntityRow) {
      data = data.getData();
    }
    this.walkValues(data, (fieldName, fieldValue) => {
      this[fieldName] = fieldValue;
    });
    return this;
  }

  deleteNow(showProgress = true) {
    return new EntityTransitionsList().deleteRow(this).save(showProgress);
  }

  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.getData();
  }
}

function getDisplayTextByProperty(row, propertyName) {
  let keyParts = [];
  row.walkValues((fieldName, value, fieldInfo) => {
    if (value && fieldInfo[propertyName]) {
      keyParts.push(value);
    }
  });
  return keyParts.join(" ");
}

// Unfortunately, we can't use "get displayText()" notation in the class, cause that way the property would be not enumerable
Object.defineProperty(EntityRow.prototype, "displayText", {
  enumerable: true,
  get() {
    return getDisplayTextByProperty(this, "displayField");
  }
});

Object.defineProperty(EntityRow.prototype, "additionalInfoText", {
  enumerable: true,
  get() {
    return getDisplayTextByProperty(this, "additionalInfoField");
  }
});

Object.defineProperty(EntityRow.prototype, "isNew", {
  enumerable: true,
  get() {
    return !getRowById(this.tableName, this.id);
  }
});
