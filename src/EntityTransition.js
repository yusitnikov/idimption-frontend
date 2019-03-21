export class EntityTransition {
  type;
  tableName;
  row;
  id;
  constructor(type, tableName, row, id = null) {
    this.type = type;
    this.tableName = tableName;
    this.row = row;
    this.id = id || row.id;
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
