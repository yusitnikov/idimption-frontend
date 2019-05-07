<template>
  <EditEntity
    :transitionsList="transitionsList"
    :savedRow="savedRow"
    :showHeader="false"
    :focusFirstInput="focusFirstInput"
    v-slot="{ update }"
  >
    <Button @click="unsubscribeFromAll">
      Unsubscribe from all notifications
    </Button>

    <FormRow :labelWidth="180" label="Subscribe to all updates" text>
      <CheckboxInput
        :value="row.subscribeToAll"
        @input="subscribeToAll => update({ subscribeToAll })"
      />
    </FormRow>

    <template v-if="!row.subscribeToAll">
      <FormRow :labelWidth="180" label="Subscribe to idea updates" text>
        <div class="line">
          <CheckboxInput
            :value="row.subscribeToAllNewIdeas"
            @input="
              subscribeToAllNewIdeas => update({ subscribeToAllNewIdeas })
            "
          >
            all new ideas
          </CheckboxInput>
        </div>

        <div class="line">
          <CheckboxInput
            :value="row.subscribeToUpdatesInMyIdeas"
            @input="
              subscribeToUpdatesInMyIdeas =>
                update({ subscribeToUpdatesInMyIdeas })
            "
          >
            in my ideas
          </CheckboxInput>
        </div>

        <FormRow label="In categories" text>
          You can manage category subscriptions on the
          <router-link to="/category">categories page</router-link>
        </FormRow>

        <FormRow label="With tags">
          <SubscriptionSelectRow
            :row="row"
            :transitionsList="transitionsList"
            linkTableName="tagsubscription"
            selectFieldName="tagId"
          />
        </FormRow>

        <FormRow label="From users">
          <SubscriptionSelectRow
            :row="row"
            :transitionsList="transitionsList"
            linkTableName="usersubscription"
            selectFieldName="dstUserId"
            :filter="user => user.id !== userId"
          />
        </FormRow>
      </FormRow>

      <FormRow :labelWidth="180" label="Subscribe to comments" text>
        <div class="line">
          <CheckboxInput
            :value="row.subscribeToCommentsOnMyIdeas"
            @input="
              subscribeToCommentsOnMyIdeas =>
                update({ subscribeToCommentsOnMyIdeas })
            "
          >
            to my ideas
          </CheckboxInput>
        </div>
        <div class="line">
          <CheckboxInput
            :value="row.subscribeToReplyComments"
            @input="
              subscribeToReplyComments => update({ subscribeToReplyComments })
            "
          >
            replies to my comments
          </CheckboxInput>
        </div>
        <div>
          <CheckboxInput
            :value="row.subscribeToMentionComments"
            @input="
              subscribeToMentionComments =>
                update({ subscribeToMentionComments })
            "
          >
            mentioning me
          </CheckboxInput>
        </div>
      </FormRow>
      <FormRow :labelWidth="180" label="Subscribe to votes" text>
        <CheckboxInput
          :value="row.subscribeToVotesInMyIdeas"
          @input="
            subscribeToVotesInMyIdeas => update({ subscribeToVotesInMyIdeas })
          "
        >
          to my ideas
        </CheckboxInput>
      </FormRow>
      <FormRow :labelWidth="180" label="Subscribe to subscriptions" text>
        <div class="line">
          <CheckboxInput
            :value="row.subscribeToWatchesInMyIdeas"
            @input="
              subscribeToWatchesInMyIdeas =>
                update({ subscribeToWatchesInMyIdeas })
            "
          >
            subscribing to my ideas
          </CheckboxInput>
        </div>
        <div>
          <CheckboxInput
            :value="row.subscribeToUnwatchesInMyIdeas"
            @input="
              subscribeToUnwatchesInMyIdeas =>
                update({ subscribeToUnwatchesInMyIdeas })
            "
          >
            un-subscribing from my ideas
          </CheckboxInput>
        </div>
      </FormRow>
    </template>
  </EditEntity>
</template>

<script>
import { mapState } from "vuex";
import { getTableFieldsArray, getForeignTableNames } from "../../EntityHelper";
import EditEntity from "./generic/EditEntity";
import FormRow from "./generic/FormRow";
import SubscriptionSelectRow from "./SubscriptionSelectRow";
import CheckboxInput from "../inputs/CheckboxInput";
import Button from "../Button";

export default {
  name: "EditSubscriptions",
  components: {
    Button,
    CheckboxInput,
    EditEntity,
    FormRow,
    SubscriptionSelectRow
  },
  props: EditEntity.commonProps,
  computed: {
    ...mapState(["userId"]),
    row() {
      return this.transitionsList.applyToRow(this.savedRow);
    }
  },
  methods: {
    unsubscribeFromAll() {
      let userUpdates = {};
      for (const fieldName of getTableFieldsArray("user")) {
        if (fieldName.startsWith("subscribe")) {
          userUpdates[fieldName] = false;
        }
      }
      this.transitionsList.updateRow(this.row, userUpdates);

      for (const tableName of getForeignTableNames("user")) {
        if (tableName.endsWith("subscription")) {
          for (const foreignRow of this.row.getForeignRows(
            tableName,
            this.transitionsList
          ).rows) {
            this.transitionsList.deleteRow(foreignRow);
          }
        }
      }
    }
  }
};
</script>
