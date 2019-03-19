import store from "./store";
import { EntityTransition } from "./EntityTransition";

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
  findTransitionByRowId(tableName, id) {
    for (const transition of this.transitions) {
      if (transition.tableName === tableName && transition.row.id === id) {
        return transition;
      }
    }
    return null;
  }
  findTransitionByRow(tableName, row) {
    return this.findTransitionByRowId(tableName, row.id);
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
  updateRow(tableName, id, updates) {
    const existingTransition = this.findTransitionByRowId(tableName, id);
    if (!existingTransition) {
      this.transitions.push(
        new EntityTransition("update", tableName, { id, ...updates })
      );
    } else {
      existingTransition.row = {
        ...existingTransition.row,
        ...updates
      };
    }
    this.clearMigratedDataCache();
  }
  deleteRow(tableName, id) {
    const existingTransition = this.findTransitionByRowId(tableName, id);
    if (!existingTransition) {
      this.transitions.push(new EntityTransition("delete", tableName, { id }));
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
        // "update" and "delete" migrations - assoc array by id
        other: {}
      };
      if (transition.type === "add") {
        transitionsMap[tableName].add.push(transition);
      } else {
        transitionsMap[tableName].other[transition.row.id] = transition;
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
          const transition = tableTransitionsMap.other[originalRow.id];
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
  applyToRow(tableName, row) {
    for (const transition of this.transitions) {
      if (transition.tableName === tableName && transition.row.id === row.id) {
        if (transition.type === "delete") {
          return null;
        }
        return {
          ...row,
          ...transition.row
        };
      }
    }

    return row;
  }
  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.transitions.map(transition => transition.toJSON());
  }
}
