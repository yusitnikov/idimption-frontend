export class EntityTransition {
  type;
  row;
  id;

  constructor(type, row, id = null) {
    this.type = type;
    this.row = row;
    this.id = id || row.id;
  }

  get tableName() {
    return this.row.tableName;
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
