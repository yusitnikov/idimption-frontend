import {
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

    this.merge(data);
  }

  getFieldsArray() {
    return getTableFieldsArray(this.tableName);
  }

  getFieldInfo(fieldName) {
    return getTableFieldInfo(this.tableName, fieldName);
  }

  getTableData() {
    return getTableData(this.tableName);
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

  getRowFullId(tableData = null) {
    tableData = tableData || this.getTableData();
    let fullId = [];
    let row = this;
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

  // Checks if this is a child of "row" or equals to it
  isChild(row, tableData = null) {
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
    let row = this;
    while (row) {
      fullName.unshift(row.displayText);
      const { parentId } = row;
      if (!parentId) {
        break;
      }
      row = getRowById(tableData, parentId);
    }
    return fullName;
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
