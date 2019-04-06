export default {
  props: {
    idimptionSelection: Object
  },
  computed: {
    computedIdimptionSelection() {
      for (let component = this; component; component = component.$parent) {
        if (component.idimptionSelection) {
          return component.idimptionSelection;
        }
      }

      return {};
    }
  },
  methods: {
    getIdimptionSelectionForTable(tableName) {
      return this.computedIdimptionSelection[tableName] || {};
    },
    getIdimptionSelectionForRow(row) {
      return row ? this.getIdimptionSelectionForTable(row.tableName) : {};
    }
  }
};
