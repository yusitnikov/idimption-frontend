<template>
  <fragment>
    <Select
      class="entity-select"
      :options="rows"
      :value="value"
      :allowAdd="allowAdd"
      :allowAddEmpty="allowAddEmpty || !!addComponent"
      :addLabel="addLabel"
      :allowEmpty="allowEmpty"
      :emptyLabel="emptyLabel"
      :emptyPlaceholder="emptyPlaceholder"
      :selectFirstOnEmpty="selectFirstOnEmpty"
      :noOptionsLabel="noOptionsLabel"
      :ignoreEvents="ignoreEvents || !!addFormRow"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @change="$event => $emit('change', $event)"
      @input="$event => $emit('input', $event)"
      @create="onCreate"
      ref="el"
    />

    <PopupForm
      v-if="addFormRow"
      title="Add new"
      @save="doCreate"
      @close="reset"
    >
      <component
        :is="addComponent"
        :savedRow="addFormRow"
        :transitionsList="addTransitionsList"
      />
    </PopupForm>
  </fragment>
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import Select from "./Select";
import PopupForm from "./PopupForm";
import { getDisplayText, createRow, resolveGuid } from "../EntityHelper";

export default {
  name: "EntitySelect",
  components: { Select, PopupForm },
  props: {
    ...Select.commonProps,
    transitionsList: {
      type: EntityTransitionsList,
      default: () => new EntityTransitionsList(true)
    },
    addField: {
      type: String,
      default: "summary"
    },
    addComponent: Object,
    filter: Function,
    tableName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      addTransitionsList: new EntityTransitionsList(),
      addFormRow: null
    };
  },
  computed: {
    updatedData() {
      return this.transitionsList.applyToState();
    },
    rows() {
      return this.updatedData[this.tableName].map(row => ({
        id: row.id,
        text: getDisplayText(row, this.tableName),
        hidden: this.filter && !this.filter(row)
      }));
    }
  },
  methods: {
    focus() {
      this.$refs.el.focus();
    },
    blur() {
      this.$refs.el.blur();
    },
    reset() {
      this.addTransitionsList.reset();
      this.addFormRow = null;
      this.$refs.el.reset();
    },
    async doCreate(row = null) {
      row = row || this.addFormRow;
      row = this.addTransitionsList.applyToRow(this.tableName, row);
      await this.addTransitionsList.save();
      await this.$nextTick();
      const id = resolveGuid(row.id);
      this.$emit("change", id);
      this.$emit("input", id);
      this.reset();
    },
    onCreate(text) {
      const row = createRow(this.tableName, {
        [this.addField]: text
      });
      this.addTransitionsList.addRow(this.tableName, row);
      if (this.addComponent) {
        this.addFormRow = row;
      } else {
        this.doCreate(row);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
