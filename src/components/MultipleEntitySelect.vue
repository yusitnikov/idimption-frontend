<template>
  <div class="multiple-entity-select">
    <span v-for="row in selectedRows" :key="row.id.toString()" class="view-tag">
      <span v-for="selectFieldName in selectFieldNames" :key="selectFieldName">
        {{ getFieldDisplayText(selectFieldName, row[selectFieldName]) }}
      </span>
      <Button class="small" @click="() => removeRow(row.id)">X</Button>
    </span>
    <span class="add-tag">
      <template v-if="adding">
        <span
          v-for="selectFieldName in selectFieldNames"
          :key="selectFieldName"
        >
          <span
            v-if="selectFieldName !== addField && addValues[selectFieldName]"
          >
            {{
              getFieldDisplayText(selectFieldName, addValues[selectFieldName])
            }}
          </span>
        </span>
        <EntitySelect
          v-if="addField"
          class="add-tag-select"
          v-model="addValues[addField]"
          :transitionsList="transitionsList"
          :tableName="getFieldTableName(addField)"
          :filter="canSelectRow"
          :allowAdd="allowAdd"
          :addComponent="addComponent"
          @blur="onAddTagSelectBlur"
          ref="addSelect"
        />
      </template>
      <Button v-else class="small" @click="startAdd">+</Button>
    </span>
  </div>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import Button from "./Button";
import EntitySelect from "./EntitySelect";
import {
  getDisplayText,
  getRowById,
  getForeignTableName,
  createRow
} from "../EntityHelper";
import Guid from "guid";

export default {
  name: "MultipleEntitySelect",
  components: { EntitySelect, Button },
  props: {
    tableName: {
      type: String,
      required: true
    },
    parentFieldName: {
      type: String,
      required: true
    },
    parentId: {
      type: [String, Guid],
      required: true
    },
    selectFieldNames: {
      type: Array,
      required: true
    },
    allowAdd: Boolean,
    addComponent: Object,
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    }
  },
  data() {
    return {
      adding: false,
      addField: null,
      addValues: {}
    };
  },
  computed: {
    updatedData() {
      return this.transitionsList.applyToState();
    },
    selectedRows() {
      return this.updatedData[this.tableName].filter(
        row => row[this.parentFieldName] === this.parentId
      );
    },
    selectedIdsMap() {
      let map = {};
      for (const row of this.selectedRows) {
        let subMap = map;
        for (const selectFieldName of this.selectFieldNames) {
          const value = row[selectFieldName];
          subMap = subMap[value] = subMap[value] || {};
        }
      }
      return map;
    }
  },
  methods: {
    getFieldTableName(fieldName) {
      return getForeignTableName(this.tableName, fieldName);
    },
    getFieldDisplayText(fieldName, fieldValue) {
      const tableName = this.getFieldTableName(fieldName);
      return getDisplayText(
        getRowById(this.updatedData[tableName], fieldValue),
        tableName
      );
    },
    canSelectRow(row) {
      if (
        this.addField !==
        this.selectFieldNames[this.selectFieldNames.length - 1]
      ) {
        return true;
      }

      let map = this.selectedIdsMap;
      for (const selectFieldName of this.selectFieldNames) {
        const value =
          selectFieldName === this.addField
            ? row.id
            : this.addValues[selectFieldName];
        map = map[value];
        if (!map) {
          return true;
        }
      }

      return false;
    },
    startAdd() {
      this.adding = true;
      this.addValues = {};
      this.focusNextAddTagSelect();
    },
    focusNextAddTagSelect() {
      for (let index = 0; index < this.selectFieldNames.length; index++) {
        const selectFieldName = this.selectFieldNames[index];
        if (!this.addValues[selectFieldName]) {
          this.addField = selectFieldName;
          this.$nextTick(() => {
            this.$refs.addSelect.focus();
          });
          return true;
        }
      }

      this.addField = null;
      return false;
    },
    onAddTagSelectBlur() {
      if (!this.addValues[this.addField]) {
        this.adding = false;
      } else if (!this.focusNextAddTagSelect()) {
        this.addRow();
      }
    },
    addRow() {
      let row = createRow(this.tableName, {
        [this.parentFieldName]: this.parentId,
        ...this.addValues
      });
      this.transitionsList.addRow(this.tableName, row);
      this.startAdd();
    },
    removeRow(id) {
      this.transitionsList.deleteRow(this.tableName, id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../styles/essentials";

.multiple-entity-select {
  display: flex;
  flex-wrap: wrap;
  row-gap: @input-vertical-padding;
}

.add-tag-select {
  display: inline-block;
  width: 400px;
}
</style>
