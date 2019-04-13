<template>
  <span class="multiple-entity-display inline-item">
    <Tag
      v-for="ids in normalizedValue"
      :key="JSON.stringify(ids)"
      :iconClass="iconClass"
      :iconTitle="iconTitle"
    >
      <slot name="before" :ids="ids" />
      <span v-for="tableName in tableNames" :key="tableName">
        <EntityById
          :tableName="tableName"
          :id="ids[tableName]"
          v-slot="{ row, displayText }"
        >
          <slot :ids="ids" v-bind="row" :row="row">
            {{ displayText }}
          </slot>
        </EntityById>
      </span>
      <slot name="after" :ids="ids" />
    </Tag>
  </span>
</template>

<script>
import EntityById from "./EntityById";
import Tag from "./Tag";
import Guid from "guid";

export default {
  name: "MultipleEntityDisplay",
  components: { EntityById, Tag },
  props: {
    ...Tag.props,
    value: {
      type: Array,
      required: true
    },
    tableNames: {
      type: Array,
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
    normalizedValue() {
      return this.value.map(ids => {
        if (typeof ids === "string" || Guid.isGuid(ids)) {
          return {
            [this.tableNames[0]]: ids
          };
        } else {
          return ids;
        }
      });
    }
  }
};
</script>
