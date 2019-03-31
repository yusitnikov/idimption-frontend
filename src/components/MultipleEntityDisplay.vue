<template>
  <span class="multiple-entity-display">
    <Tag
      v-for="linkRow in linkRows"
      :key="linkRow.id.toString()"
      :class="'tag--' + tableName"
      :iconClass="iconClass"
      :iconTitle="iconTitle"
    >
      <slot name="before" :linkRow="linkRow" />
      <span v-for="fieldName in fieldNames" :key="fieldName">
        <ForeignEntityById
          :tableName="tableName"
          :fieldName="fieldName"
          :id="linkRow[fieldName]"
          v-slot="{ foreignTableName, row, displayText, additionalInfoText }"
        >
          <slot
            :fieldName="fieldName"
            :tableName="foreignTableName"
            :linkRow="linkRow"
            :row="row"
            :displayText="displayText"
            :additionalInfoText="additionalInfoText"
          >
            {{ displayText }}
          </slot>
        </ForeignEntityById>
      </span>
      <slot name="after" :linkRow="linkRow" />
    </Tag>
  </span>
</template>

<script>
import ForeignEntityById from "./ForeignEntityById";
import Tag from "./Tag";
import EntityTransitionsList from "../EntityTransitionsList";
import Guid from "guid";

export default {
  name: "MultipleEntityDisplay",
  components: { ForeignEntityById, Tag },
  props: {
    ...Tag.props,
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
    fieldNames: {
      type: Array,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      default: () => new EntityTransitionsList()
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
    linkRows() {
      return this.updatedData[this.tableName].filter(
        row => row[this.parentFieldName] === this.parentId
      );
    }
  }
};
</script>

<style scoped lang="less">
@import "../styles/essentials";

.view-tag {
  margin-right: @button-distance;
}
</style>
