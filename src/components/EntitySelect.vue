<template>
  <Select
    class="entity-select"
    :options="rows"
    :value="value"
    :allowAdd="allowAdd"
    :allowEmpty="allowEmpty"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @change="$event => $emit('change', $event)"
    @input="$event => $emit('input', $event)"
    @create="onCreate"
    ref="el"
  />
</template>

<script>
import EntityTransitionsList from "../EntityTransitionsList";
import Select from "./Select";
import { getDisplayText } from "../EntityHelper";
import Guid from "guid";

export default {
  name: "EntitySelect",
  components: { Select },
  props: {
    value: [String, Guid],
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    },
    allowAdd: Boolean,
    allowEmpty: Boolean,
    filter: Function,
    tableName: {
      type: String,
      required: true
    }
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
    onCreate(text) {
      console.log("Wanna create", text);
      const row = {
        id: Guid.create(),
        summary: text
      };
      this.transitionsList.addRow(this.tableName, row);
      this.$emit("change", row.id);
      this.$emit("input", row.id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less"></style>
