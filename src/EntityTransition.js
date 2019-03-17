import { getPrimaryKey } from "./EntityHelper";

export class EntityTransition {
  type;
  tableName;
  row;
  primaryKey;
  constructor(type, tableName, row) {
    this.type = type;
    this.tableName = tableName;
    this.row = row;
    this.primaryKey = getPrimaryKey(row, tableName);
  }
  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return {
      type: this.type,
      tableName: this.tableName,
      row: this.row
    };
  }
}
