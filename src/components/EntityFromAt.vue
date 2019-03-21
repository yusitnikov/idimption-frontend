<template>
  <fragment>
    <template v-if="showUser">
      from
      <EntityById tableName="user" :id="row.userId" v-slot="{ displayText }">
        {{ displayText || "Anonymous" }}
      </EntityById>
    </template>
    <!--suppress JSUnresolvedVariable -->
    <template v-if="row.createdAt">
      at
      <!--suppress JSUnresolvedVariable -->
      <DateTime :value="row.createdAt" />
    </template>
    <!--suppress JSUnresolvedVariable -->
    <template v-if="row.updatedAt && row.updatedAt !== row.createdAt">
      updated at
      <!--suppress JSUnresolvedVariable -->
      <DateTime :value="row.updatedAt" />
    </template>
  </fragment>
</template>

<script>
import EntityById from "./EntityById";
import DateTime from "./DateTime";

export default {
  name: "EntityFromAt",
  components: { EntityById, DateTime },
  props: {
    row: {
      type: Object,
      required: true
    },
    showUser: Boolean
  }
};
</script>
