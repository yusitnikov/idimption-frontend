import Vue from "vue";

export class TableData {
  rows;
  cache;

  constructor(rows = []) {
    this.rows = rows;
    this.clearCache();
  }

  get length() {
    return this.rows.length;
  }

  push(row) {
    this.rows.push(row);
    this.clearCache();
  }

  remove(row) {
    this.rows.splice(this.rows.indexOf(row), 1);
  }

  filter(callback) {
    return callback ? new TableData(this.rows.filter(callback)) : this;
  }

  sort(callback) {
    // Clone the rows
    let rows = [...this.rows];
    rows.sort(callback);
    return new TableData(rows);
  }

  map(callback) {
    return this.rows.map(callback);
  }

  clearCache() {
    this.cache = {};
  }

  getFromCacheOrCallback(key, callback) {
    const { cache } = this;
    if (!cache[key]) {
      Vue.set(cache, key, callback());
    }
    return cache[key];
  }

  mapRowByFieldValue(fieldName) {
    return this.getFromCacheOrCallback("row-by-" + fieldName, () => {
      const map = {};
      for (const row of this.rows) {
        Vue.set(map, (row[fieldName] || "").toString(), row);
      }
      return map;
    });
  }

  getRowByFieldValue(fieldName, fieldValue) {
    return (
      this.mapRowByFieldValue(fieldName)[(fieldValue || "").toString()] || null
    );
  }

  getRowById(id) {
    return this.getRowByFieldValue("id", id);
  }

  getFieldValues(fieldName) {
    return this.rows.map(row => row[fieldName]);
  }

  getIds() {
    return this.getFieldValues("id");
  }

  mapRowsByFieldValue(fieldName) {
    return this.getFromCacheOrCallback("rows-by-" + fieldName, () => {
      const map = {};
      for (const row of this.rows) {
        let value = (row[fieldName] || "").toString();
        if (!map[value]) {
          Vue.set(map, value, new TableData());
        }
        map[value].push(row);
      }
      return map;
    });
  }

  getRowsByFieldValue(fieldName, fieldValue) {
    return (
      this.mapRowsByFieldValue(fieldName)[(fieldValue || "").toString()] ||
      new TableData()
    );
  }

  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.rows;
  }
}
