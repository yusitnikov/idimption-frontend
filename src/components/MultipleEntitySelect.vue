<template>
  <div class="multiple-entity-select inline-item">
    <MultipleEntityDisplay
      :value="value"
      :tableNames="selectTableNames"
      :iconClass="iconClass"
      :iconTitle="iconTitle"
      v-if="value.length"
    >
      <template #before="params">
        <slot name="before" v-bind="params" />
      </template>
      <template #default="params">
        <slot v-bind="params" />
      </template>
      <template #after="params">
        <slot name="after" v-bind="params" />
        {{ " " }}
        <Button class="small no-margin" @click="() => removeRow(params.ids)">
          <Icon type="times" />
        </Button>
      </template>
    </MultipleEntityDisplay>

    <span class="add-tag inline-item">
      <template v-if="adding || alwaysOpened">
        <span
          v-for="selectTableName in selectTableNames"
          :key="selectTableName"
        >
          <span
            v-if="
              selectTableName !== addTableName && addValues[selectTableName]
            "
          >
            <EntityById
              :tableName="selectTableName"
              :id="addValues[selectTableName]"
            />
            {{ " " }}
          </span>
        </span>
        <EntitySelect
          v-if="addTableName"
          class="add-tag-select"
          v-model="addValues[addTableName]"
          :transitionsList="transitionsList"
          :tableName="addTableName"
          :filter="displayRow"
          :tipFunction="tipFunction"
          :emptyPlaceholder="normalizedPlaceholder[addTableName]"
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
import EntityTransitionsList from "../EntityTransitionsList";
import MultipleEntityDisplay from "./MultipleEntityDisplay";
import Button from "./Button";
import Icon from "./Icon";
import EntitySelect from "./EntitySelect";
import EntityById from "./EntityById";
import Tag from "./Tag";

export default {
  name: "MultipleEntitySelect",
  components: {
    EntityById,
    MultipleEntityDisplay,
    EntitySelect,
    Button,
    Icon
  },
  props: {
    ...Tag.props,
    value: {
      type: Array,
      required: true
    },
    filter: Function,
    tipFunction: Function,
    plainValue: Boolean,
    selectTableNames: {
      type: Array,
      required: true
    },
    alwaysOpened: Boolean,
    placeholder: [String, Array],
    allowAdd: Boolean,
    addComponent: Object,
    transitionsList: EntityTransitionsList
  },
  data() {
    return {
      adding: false,
      addTableName: null,
      addValues: {}
    };
  },
  created() {
    this.addTableName = this.selectTableNames[0];
  },
  computed: {
    normalizedValue() {
      return this.value.map(ids => {
        if (this.plainValue) {
          return {
            [this.selectTableNames[0]]: ids
          };
        } else {
          return ids;
        }
      });
    },
    normalizedPlaceholder() {
      if (typeof this.placeholder !== "object") {
        let placeholder = {};
        for (const selectTableName of this.selectTableNames) {
          placeholder[selectTableName] = this.placeholder;
        }
        return placeholder;
      } else {
        return this.placeholder;
      }
    },
    selectedIdsMap() {
      let map = {};
      for (const ids of this.normalizedValue) {
        let subMap = map;
        for (const selectTableName of this.selectTableNames) {
          const id = ids[selectTableName].toString();
          subMap = subMap[id] = subMap[id] || {};
        }
      }
      return map;
    }
  },
  methods: {
    displayRow(row) {
      if (this.filter && !this.filter(row)) {
        return false;
      }

      if (
        this.addTableName !==
        this.selectTableNames[this.selectTableNames.length - 1]
      ) {
        return true;
      }

      let map = this.selectedIdsMap;
      for (const selectTableName of this.selectTableNames) {
        const id =
          selectTableName === this.addTableName
            ? row.id
            : this.addValues[selectTableName];
        map = map[id.toString()];
        if (!map) {
          return true;
        }
      }

      return false;
    },
    async startAdd() {
      await timeout();
      this.adding = true;
      this.addValues = {};
      this.focusNextAddTagSelect();
    },
    focusNextAddTagSelect() {
      for (let index = 0; index < this.selectTableNames.length; index++) {
        const selectTableName = this.selectTableNames[index];
        if (!this.addValues[selectTableName]) {
          this.addTableName = selectTableName;
          this.adding = true;
          // use timeout instead of $nextTick to do focus() after bubbling onClick
          timeout().then(() => {
            this.$refs.addSelect.focus();
          });
          return true;
        }
      }

      this.addTableName = null;
      return false;
    },
    onAddTagSelectBlur() {
      if (!this.addValues[this.addTableName]) {
        this.adding = false;
      } else if (!this.focusNextAddTagSelect()) {
        this.addRow();
      }
    },
    denormalizeIds(ids) {
      return this.plainValue ? ids[this.selectTableNames[0]] : ids;
    },
    addRow() {
      const ids = this.denormalizeIds(this.addValues);
      this.$emit("add", ids);
      const newValue = [...this.value, ids];
      this.$emit("input", newValue);
      this.$emit("change", newValue);
      this.startAdd();
    },
    async removeRow(ids) {
      await timeout();
      ids = this.denormalizeIds(ids);
      this.$emit("remove", ids);
      const newValue = this.value.filter(valueIds => valueIds !== ids);
      this.$emit("input", newValue);
      this.$emit("change", newValue);
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
