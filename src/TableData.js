import Vue from "vue";
import { normalizeUserInput } from "./misc";

function normalizeFieldValue(fieldValue, isUserInput) {
  fieldValue = (fieldValue || "").toString();
  if (isUserInput) {
    fieldValue = normalizeUserInput(fieldValue);
  }
  return fieldValue;
}

function plainifySubTree(data, parentId) {
  let result = [];
  for (const row of data.getRowsByFieldValue("parentId", parentId).rows) {
    result.push(row, ...plainifySubTree(data, row.id));
  }
  return result;
}

export class TableData {
  rows;
  matchingRowIds;
  cache;

  constructor(rows = [], matchingRowIds = null) {
    this.rows = rows;
    this.matchingRowIds = matchingRowIds;
    this.clearCache();
  }

  get length() {
    return this.rows.length;
  }

  push(...rows) {
    this.rows.push(...rows);
    this.clearCache();
  }

  remove(row) {
    this.rows.splice(this.rows.indexOf(row), 1);
    this.clearCache();
  }

  filter(callback) {
    if (!callback) {
      return this;
    }

    let matchingRowIds = new Set();
    let matchingChildrenIds = new Set();
    for (const row of this.rows) {
      if (this.isMatchingRow(row) && callback(row)) {
        matchingRowIds.add(row.id);
        for (let parent = row; parent; parent = parent.getParent(this)) {
          if (matchingChildrenIds.has(parent.id)) {
            break;
          } else {
            matchingChildrenIds.add(parent.id);
          }
        }
      }
    }
    return new TableData(
      this.rows.filter(row => matchingChildrenIds.has(row.id)),
      matchingRowIds
    );
  }

  isMatchingRow(row) {
    return !this.matchingRowIds || this.matchingRowIds.has(row.id);
  }

  clone() {
    return new TableData([...this.rows], this.matchingRowIds);
  }

  reverse() {
    return this.getFromCacheOrCallback("reverse", () => {
      let result = this.clone();
      result.rows.reverse();
      return result;
    });
  }

  sort(key, callback) {
    return this.getFromCacheOrCallback("sort-" + key, () => {
      let result = this.clone();
      result.rows.sort(callback);
      return result;
    });
  }

  sortTree() {
    return this.getFromCacheOrCallback(
      "sorted-tree",
      () => new TableData(plainifySubTree(this, null), this.matchingRowIds)
    );
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

  mapRowByFieldValue(fieldName, isUserInput = false) {
    return this.getFromCacheOrCallback("row-by-" + fieldName, () => {
      const map = {};
      for (const row of this.rows) {
        Vue.set(map, normalizeFieldValue(row[fieldName], isUserInput), row);
      }
      return map;
    });
  }

  getRowByFieldValue(fieldName, fieldValue, isUserInput = false) {
    fieldValue = normalizeFieldValue(fieldValue, isUserInput);
    return this.mapRowByFieldValue(fieldName, isUserInput)[fieldValue] || null;
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

  mapRowsByFieldValue(fieldName, isUserInput = false) {
    return this.getFromCacheOrCallback("rows-by-" + fieldName, () => {
      const map = {};
      for (const row of this.rows) {
        let value = normalizeFieldValue(row[fieldName], isUserInput);
        if (!map[value]) {
          Vue.set(map, value, new TableData([], this.matchingRowIds));
        }
        map[value].push(row);
      }
      return map;
    });
  }

  getRowsByFieldValue(fieldName, fieldValue, isUserInput = false) {
    fieldValue = normalizeFieldValue(fieldValue, isUserInput);
    return (
      this.mapRowsByFieldValue(fieldName, isUserInput)[fieldValue] ||
      new TableData()
    );
  }

  getAllChildrenIdsSet(ids) {
    const set = new Set(ids);
    const rows = ids.map(id => this.getRowById(id));
    for (const row of this.rows) {
      if (!set.has(row.id) && row.isChild(rows)) {
        set.add(row.id);
      }
    }
    return set;
  }

  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.rows;
  }
}
