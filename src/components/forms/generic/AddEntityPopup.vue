<template>
  <PopupForm :title="title" @save="save" @close="close">
    <slot :addRow="row" :addTransitionsList="transitionsList" />
  </PopupForm>
</template>

<script>
import EntityTransitionsList from "../../../EntityTransitionsList";
import { resolveGuid } from "../../../EntityHelper";
import { EntityRow } from "../../../EntityRow";
import PopupForm from "../../forms/generic/PopupForm";

export default {
  name: "AddEntityPopup",
  components: { PopupForm },
  props: {
    title: {
      type: String,
      required: true
    },
    tableName: {
      type: String,
      required: true
    },
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    defaultForeignRows: Function
  },
  data() {
    const transitionsList = new EntityTransitionsList();
    const row = new EntityRow(this.tableName, this.defaultValues, true);
    transitionsList.addRow(row);
    if (this.defaultForeignRows) {
      for (const foreignRow of this.defaultForeignRows(row.id)) {
        transitionsList.addRow(foreignRow);
      }
    }
    return {
      transitionsList,
      row
    };
  },
  methods: {
    async save() {
      const row = this.transitionsList.applyToRow(this.row);
      await this.transitionsList.save();
      await this.$nextTick();
      this.$emit("save", resolveGuid(row.id));
      this.close();
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
