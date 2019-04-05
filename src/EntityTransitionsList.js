import { applyTransitions, getData, getDataVersion } from "./storeProxy";
import { EntityTransition } from "./EntityTransition";
import { EntityRow } from "./EntityRow";

export default class EntityTransitionsList {
  transitions;
  migratedDataCache;
  cachedDataVersion;
  autoSave;
  constructor(autoSave = false) {
    this.transitions = [];
    this.migratedDataCache = null;
    this.cachedDataVersion = null;
    this.autoSave = autoSave;
  }
  findTransitionByRowId(tableName, id) {
    for (const transition of this.transitions) {
      if (transition.tableName === tableName && transition.id === id) {
        return transition;
      }
    }
    return null;
  }
  findTransitionByRow(row) {
    return this.findTransitionByRowId(row.tableName, row.id);
  }
  // noinspection JSUnusedGlobalSymbols
  isEmpty() {
    return this.transitions.length === 0;
  }
  reset() {
    this.transitions = [];
    this.clearMigratedDataCache();
    return this;
  }
  _onTransitionsChanged() {
    if (this.autoSave) {
      this.save();
    }
    this.clearMigratedDataCache();
    return this;
  }
  addRow(row) {
    this.transitions.push(new EntityTransition("add", row));
    this._onTransitionsChanged();
    return this;
  }
  updateRow(row, updates) {
    const existingTransition = this.findTransitionByRow(row);
    if (!existingTransition) {
      this.transitions.push(
        new EntityTransition(
          "update",
          new EntityRow(row.tableName, { id: row.id, ...updates }, false)
        )
      );
    } else {
      existingTransition.row.merge(updates);
    }
    this._onTransitionsChanged();
    return this;
  }
  deleteRow(row) {
    const existingTransition = this.findTransitionByRow(row);
    if (!existingTransition) {
      this.transitions.push(new EntityTransition("delete", row));
    } else if (existingTransition.type === "add") {
      // remove existingTransition from the array
      this.transitions.splice(this.transitions.indexOf(existingTransition), 1);
    } else {
      existingTransition.type = "delete";
    }
    this._onTransitionsChanged();
    return this;
  }
  save(showProgress = true) {
    return applyTransitions(this, showProgress);
  }
  clearMigratedDataCache() {
    this.migratedDataCache = null;
    return this;
  }
  applyToState() {
    const data = getData();
    const dataVersion = getDataVersion();
    if (this.migratedDataCache && this.cachedDataVersion === dataVersion) {
      return this.migratedDataCache;
    }
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
        transitionsMap[tableName].other[transition.id] = transition;
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
            migratedData[tableName].push(
              originalRow.clone().merge(transition.row)
            );
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
  applyToRow(row) {
    for (const transition of this.transitions) {
      if (transition.tableName === row.tableName && transition.id === row.id) {
        if (transition.type === "delete") {
          return null;
        }
        return row.clone().merge(transition.row);
      }
    }

    return row;
  }
  // noinspection JSUnusedGlobalSymbols
  toJSON() {
    return this.transitions.map(transition => transition.toJSON());
  }
}
