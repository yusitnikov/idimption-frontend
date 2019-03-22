<template>
  <fragment>
    <EntityById
      :tableName="foreignTableName"
      :id="id"
      v-slot="{ row, displayText, additionalInfoText }"
    >
      <slot
        :foreignTableName="foreignTableName"
        :row="row"
        :displayText="displayText"
        :additionalInfoText="additionalInfoText"
      />
    </EntityById>
  </fragment>
</template>

<script>
import EntityById from "./EntityById";
import { getForeignTableName } from "../EntityHelper";

export default {
  name: "ForeignEntityById",
  components: { EntityById },
  props: {
    tableName: {
      type: String,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    foreignTableName() {
      return getForeignTableName(this.tableName, this.fieldName);
    }
  }
};
</script>
