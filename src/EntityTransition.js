export class EntityTransition {
  type;
  tableName;
  row;
  constructor(type, tableName, row) {
    this.type = type;
    this.tableName = tableName;
    this.row = row;
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
