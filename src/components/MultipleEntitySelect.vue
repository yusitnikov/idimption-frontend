<template>
  <div class="multiple-entity-select">
    <MultipleEntityDisplay
      :tableName="tableName"
      :parentFieldName="parentFieldName"
      :parentId="parentId"
      :fieldNames="selectFieldNames"
      :transitionsList="transitionsList"
    >
      <template #after="{ linkRow }">
        <!--suppress JSUnresolvedVariable -->
        <Button class="small" @click="() => removeRow(linkRow)">
          <Icon type="times" />
        </Button>
      </template>
    </MultipleEntityDisplay>

    <span class="add-tag">
      <template v-if="adding">
        <span
          v-for="selectFieldName in selectFieldNames"
          :key="selectFieldName"
        >
          <span
            v-if="selectFieldName !== addField && addValues[selectFieldName]"
          >
            <ForeignEntityById
              :tableName="tableName"
              :fieldName="selectFieldName"
              :id="addValues[selectFieldName]"
            />
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
      <Button v-else class="small" @click="startAdd">
        <Icon type="plus" />
      </Button>
    </span>
  </div>
</template>

<script>
import { timeout } from "../misc";
import { getForeignTableName } from "../EntityHelper";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import Guid from "guid";
import MultipleEntityDisplay from "./MultipleEntityDisplay";
import Button from "./Button";
import Icon from "./Icon";
import EntitySelect from "./EntitySelect";
import ForeignEntityById from "./ForeignEntityById";

export default {
  name: "MultipleEntitySelect",
  components: {
    ForeignEntityById,
    MultipleEntityDisplay,
    EntitySelect,
    Button,
    Icon
  },
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
          // use timeout instead of $nextTick to do focus() after bubbling onClick
          timeout().then(() => {
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
      let row = new EntityRow(
        this.tableName,
        {
          [this.parentFieldName]: this.parentId,
          ...this.addValues
        },
        true
      );
      this.transitionsList.addRow(row);
      this.startAdd();
    },
    removeRow(row) {
      this.transitionsList.deleteRow(row);
    }
  }
};
</script>

<style lang="less">
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
