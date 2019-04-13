<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="showHeader"
    :focusFirstInput="focusFirstInput"
  >
    <template slot="title" v-if="ideaCount">
      <ButtonLink align="right" :href="'/idea?cat=' + savedRow.id">
        <Icon type="lightbulb" title="Ideas" />
        {{ ideaCount }}
      </ButtonLink>
    </template>

    <template #default="{ row, isCreating, update }">
      <div
        :class="{
          readonly: true,
          'next-section-start': showHeader && !isCreating
        }"
        v-if="readOnly"
      >
        <!-- eslint-disable-next-line -->
        <div class="description multi-line"><AutoLink :text="row.description || 'No description provided.'" /></div>
      </div>
      <div
        :class="{
          editable: true,
          'next-section-start': showHeader && !isCreating
        }"
        v-else
      >
        <EditCommonTextFields :row="row" :transitionsList="transitionsList" />

        <FormRow label="Parent">
          <!--suppress JSUnresolvedVariable -->
          <EntitySelect
            :transitionsList="transitionsList"
            :value="row.parentId"
            @change="parentId => update({ parentId })"
            :filter="isAllowedParent"
            tableName="category"
            allowEmpty
          />
        </FormRow>
      </div>
    </template>
  </EditEntity>
</template>

<script>
import EditEntity from "./EditEntity";
import ButtonLink from "./ButtonLink";
import Icon from "./Icon";
import FormRow from "./FormRow";
import EditCommonTextFields from "./EditCommonTextFields";
import EntitySelect from "./EntitySelect";
import AutoLink from "./AutoLink";

export default {
  name: "EditCategory",
  components: {
    EditEntity,
    ButtonLink,
    Icon,
    FormRow,
    EditCommonTextFields,
    EntitySelect,
    AutoLink
  },
  props: {
    ...EditEntity.commonProps,
    readOnly: Boolean
  },
  computed: {
    ideaCount() {
      return (
        this.savedRow &&
        this.savedRow.getForeignIds("ideacategory", "ideaId", null, true).length
      );
    }
  },
  methods: {
    isAllowedParent(category) {
      return !category.isChild(this.savedRow);
    }
  }
};
</script>
