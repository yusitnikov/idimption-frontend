<template>
  <div class="entity-from-at line">
    <!--suppress JSUnresolvedVariable -->
    <span class="inline-item" v-if="showUser || row.createdAt || row.updatedAt">
      <template v-if="showUser">
        from
        <EntityById tableName="user" :id="row.userId" v-slot="{ displayText }">
          {{ displayText || "Guest" }}
        </EntityById>

        <slot name="user" />
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
    </span>

    <slot />
  </div>
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

<style scoped lang="less">
.entity-from-at {
  font-weight: bold;
  color: #888;
}
</style>
