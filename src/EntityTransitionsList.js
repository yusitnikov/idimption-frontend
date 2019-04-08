import Vue from "vue";
import { applyTransitions, getTableData, getDataVersion } from "./storeProxy";
import { EntityTransition } from "./EntityTransition";
import { TableData } from "./TableData";
import { EntityRow } from "./EntityRow";

export default class EntityTransitionsList {
  transitions;
  migratedDataCache;
  cachedDataVersion;
  autoSave;

  constructor(autoSave = false) {
    this.autoSave = autoSave;
    this.cachedDataVersion = null;
    this.reset();
  }

  reset() {
    this.transitions = new TableData();
    this.migratedDataCache = {};
    return this;
  }

  clearMigratedDataCacheForTable(tableName) {
    Vue.delete(this.migratedDataCache, tableName);
    return this;
  }

  getTableTransitions(tableName) {
    return this.transitions.getRowsByFieldValue("tableName", tableName);
  }

  findTransitionByRowId(tableName, id) {
    return this.getTableTransitions(tableName).getRowById(id);
  }

  findTransitionByRow(row) {
    return this.findTransitionByRowId(row.tableName, row.id);
  }

  // noinspection JSUnusedGlobalSymbols
  isEmpty() {
    return this.transitions.length === 0;
  }

  _onTransitionsChanged(tableName) {
    if (this.autoSave) {
      this.save();
    }
    this.clearMigratedDataCacheForTable(tableName);
    return this;
  }

  addTransition(transition) {
    this.transitions.push(transition);
    return this._onTransitionsChanged(transition.tableName);
  }

  removeTransition(transition) {
    this.transitions.remove(transition);
    return this._onTransitionsChanged(transition.tableName);
  }

  addRow(row) {
    return this.addTransition(new EntityTransition("add", row));
  }

  updateRow(row, updates) {
    const existingTransition = this.findTransitionByRow(row);
    if (!existingTransition) {
      return this.addTransition(
        new EntityTransition(
          "update",
          new EntityRow(row.tableName, { id: row.id, ...updates }, false)
        )
      );
    } else {
      existingTransition.row.merge(updates);
    }
    return this._onTransitionsChanged(row.tableName);
  }

  deleteRow(row) {
    const existingTransition = this.findTransitionByRow(row);
    if (!existingTransition) {
      return this.addTransition(new EntityTransition("delete", row));
    } else if (existingTransition.type === "add") {
      return this.removeTransition(existingTransition);
    } else {
      existingTransition.type = "delete";
    }
    return this._onTransitionsChanged(row.tableName);
  }

  save(showProgress = true) {
    return applyTransitions(this, showProgress);
  }

  getTableData(tableName) {
    // Check if the original data was changed
    const dataVersion = getDataVersion();
    if (this.cachedDataVersion !== dataVersion) {
      this.migratedDataCache = {};
      this.cachedDataVersion = dataVersion;
    }

    // Look in the cache
    const { migratedDataCache } = this;
    if (migratedDataCache[tableName]) {
      return migratedDataCache[tableName];
    }

    const originalData = getTableData(tableName);
    const tableTransitions = this.getTableTransitions(tableName);
    if (tableTransitions.length === 0) {
      // There are no transitions for this table, just return the original data
      return originalData;
    }

    // Apply transitions to the original rows
    let migratedData = new TableData();

    // Apply "update" and "delete" migrations
    for (const originalRow of originalData.rows) {
      const transition = this.findTransitionByRow(originalRow);
      if (!transition) {
        // use the original row
        migratedData.push(originalRow);
      } else if (transition.type === "update") {
        // use the row from the transition
        migratedData.push(originalRow.clone().merge(transition.row));
      } else {
        // type is "delete" - just skip the row
      }
    }

    // Apply "add" migrations
    for (const transition of tableTransitions.rows) {
      if (transition.type === "add") {
        migratedData.push(transition.row);
      }
    }

    Vue.set(migratedDataCache, tableName, migratedData);
    return migratedData;
  }

  applyToRow(row) {
    return this.getTableData(row.tableName).getRowById(row.id);
  }

  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.transitions.map(transition => transition.toJSON());
  }
}
