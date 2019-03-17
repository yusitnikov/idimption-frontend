import store from "./store";
import { EntityTransition } from "./EntityTransition";
import { getPrimaryKey } from "./EntityHelper";

export default class EntityTransitionsList {
  transitions;
  migratedDataCache;
  cachedDataVersion;
  constructor() {
    console.log("Construct EntityTransitionsList");
    this.transitions = [];
    this.migratedDataCache = null;
    this.cachedDataVersion = null;
  }
  findTransitionByRowPrimaryKey(tableName, primaryKey) {
    for (const transition of this.transitions) {
      if (
        transition.tableName === tableName &&
        transition.primaryKey === primaryKey
      ) {
        return transition;
      }
    }
    return null;
  }
  findTransitionByRow(tableName, row) {
    return this.findTransitionByRowPrimaryKey(
      tableName,
      getPrimaryKey(row, tableName)
    );
  }
  // noinspection JSUnusedGlobalSymbols
  isEmpty() {
    return this.transitions.length === 0;
  }
  reset() {
    this.transitions = [];
    this.clearMigratedDataCache();
  }
  addRow(tableName, row) {
    this.transitions.push(new EntityTransition("add", tableName, row));
    this.clearMigratedDataCache();
  }
  updateRow(tableName, row) {
    const existingTransition = this.findTransitionByRow(tableName, row);
    if (!existingTransition) {
      this.transitions.push(new EntityTransition("update", tableName, row));
    } else {
      existingTransition.row = row;
    }
    this.clearMigratedDataCache();
  }
  deleteRow(tableName, row) {
    const existingTransition = this.findTransitionByRow(tableName, row);
    if (!existingTransition) {
      this.transitions.push(new EntityTransition("delete", tableName, row));
    } else if (existingTransition.type === "add") {
      // remove existingTransition from the array
      this.transitions.splice(this.transitions.indexOf(existingTransition), 1);
    } else {
      existingTransition.type = "delete";
    }
    this.clearMigratedDataCache();
  }
  clearMigratedDataCache() {
    this.migratedDataCache = null;
  }
  applyToState() {
    // noinspection JSUnresolvedVariable
    const { data, dataVersion } = store.state;
    if (this.migratedDataCache && this.cachedDataVersion === dataVersion) {
      return this.migratedDataCache;
    }
    console.log("Recalculate migrated data");
    // Build the transitions map: by tableName, type and row primary key
    let transitionsMap = {};
    for (const transition of this.transitions) {
      const tableName = transition.tableName;
      transitionsMap[tableName] = transitionsMap[tableName] || {
        // "add" migrations - plain list
        add: [],
        // "update" and "delete" migrations - assoc array by primaryKey
        other: {}
      };
      if (transition.type === "add") {
        transitionsMap[tableName].add.push(transition);
      } else {
        transitionsMap[tableName].other[transition.primaryKey] = transition;
      }
    }

    // Apply transitions to the original rows
    let migratedData = {};
    for (const tableName in data) {
      if (data.hasOwnProperty(tableName)) {
        const tableTransitionsMap = transitionsMap[tableName] || {
          add: [],
          other: {}
        };
        migratedData[tableName] = [];

        // Apply "update" and "delete" migrations
        for (const originalRow of data[tableName]) {
          const primaryKey = getPrimaryKey(originalRow, tableName);
          const transition = tableTransitionsMap.other[primaryKey];
          if (!transition) {
            // use the original row
            migratedData[tableName].push(originalRow);
          } else if (transition.type === "update") {
            // use the row from the transition
            migratedData[tableName].push(transition.row);
          } else {
            // type is "delete" - just skip the row
          }
        }

        // Apply "add" migrations
        for (const transition of tableTransitionsMap.add) {
          migratedData[tableName].push(transition.row);
        }
      }
    }

    this.migratedDataCache = migratedData;
    this.cachedDataVersion = dataVersion;
    return migratedData;
  }
  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.transitions.map(transition => transition.toJSON());
  }
}
