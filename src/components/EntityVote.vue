<template>
  <div class="entity-vote inline-item">
    <ButtonLink
      :class="[
        'no-margin',
        currentVote && currentVote.isPositive ? 'vote-positive' : 'vote-none'
      ]"
      plain
      customColors
      :title="getVotesByIsPositive(true).join('\n')"
      @click="event => toggle(event, true)"
    >
      <Icon type="thumbs-up" />
      {{ getVotesByIsPositive(true).length }}
    </ButtonLink>
    <ButtonLink
      :class="[
        'no-margin',
        currentVote && !currentVote.isPositive ? 'vote-negative' : 'vote-none'
      ]"
      plain
      customColors
      :title="getVotesByIsPositive(false).join('\n')"
      @click="event => toggle(event, false)"
    >
      <Icon type="thumbs-down" />
      {{ getVotesByIsPositive(false).length }}
    </ButtonLink>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { openPopup } from "../storeProxy";
import EntityTransitionsList from "../EntityTransitionsList";
import { EntityRow } from "../EntityRow";
import { getRowById } from "../EntityHelper";
import ButtonLink from "./ButtonLink";
import Icon from "./Icon";

export default {
  name: "EntityVote",
  components: { ButtonLink, Icon },
  props: {
    row: {
      type: EntityRow,
      required: true
    }
  },
  data() {
    return {
      transitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["verifiedEmail"]),
    foreignTableName() {
      return this.row.tableName + "vote";
    },
    foreignFieldName() {
      return this.row.tableName + "Id";
    },
    allVotes() {
      return this.row.getForeignRows(
        this.foreignTableName,
        this.transitionsList
      );
    },
    currentVote() {
      return this.allVotes.getRowByFieldValue("userId", this.userId);
    }
  },
  methods: {
    getVotesByIsPositive(isPositive) {
      return this.allVotes
        .getRowsByFieldValue("isPositive", isPositive)
        .map(row => getRowById("user", row.userId).displayText);
    },
    async toggle(event, isPositive) {
      event.stopPropagation();

      const wasGuest = !this.userId;
      if (wasGuest) {
        await openPopup(
          "login",
          "Sorry, but guests are not allowed to vote.\nPlease login or register."
        );
        await this.$nextTick();
      }

      if (!this.userId) {
        return;
      }

      if (!this.verifiedEmail) {
        alert("Please verify your email in order to vote");
        return;
      }

      const vote = this.currentVote;
      if (!vote) {
        this.transitionsList.addRow(
          new EntityRow(
            this.foreignTableName,
            {
              [this.foreignFieldName]: this.row.id,
              userId: this.userId,
              isPositive
            },
            true
          )
        );
      } else if (vote.isPositive !== isPositive) {
        this.transitionsList.updateRow(vote, { isPositive });
      } else if (!wasGuest) {
        this.transitionsList.deleteRow(vote);
      }
      this.transitionsList.save(false);
    }
  }
};
</script>

<style lang="less">
@import "../styles/essentials";

.entity-vote {
  display: inline;
  font-weight: normal;

  .vote-none .link {
    .color-with-hover(#ccc);
  }

  .vote-positive .link {
    .color-with-hover(@success-color);
  }

  .vote-negative .link {
    .color-with-hover(@error-color);
  }
}
</style>
