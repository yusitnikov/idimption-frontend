<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="showHeader"
    :focusFirstInput="focusFirstInput"
    showSubscriptions
  >
    <template slot="entity-from-at" v-if="ideaCount">
      <ButtonLink class="ideas-link" :href="'/idea?cat=' + savedRow.id">
        <Icon type="lightbulb" title="Ideas" />
        <span>{{ ideaCount }}</span>
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
import EditEntity from "./generic/EditEntity";
import ButtonLink from "../ButtonLink";
import Icon from "../displayHelpers/Icon";
import FormRow from "./generic/FormRow";
import EditCommonTextFields from "./generic/EditCommonTextFields";
import EntitySelect from "../inputs/EntitySelect";
import AutoLink from "../displayHelpers/AutoLink";

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

<style scoped lang="less">
.ideas-link {
  font-weight: normal;
}
</style>
