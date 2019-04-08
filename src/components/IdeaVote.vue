<template>
  <div class="idea-vote">
    <ButtonLink
      :class="
        currentVote && currentVote.isPositive ? 'vote-positive' : 'vote-none'
      "
      align="none"
      plain
      customColors
      @click="event => toggle(event, true)"
    >
      <Icon type="thumbs-up" />
      {{ getVotesByIsPositive(true).length }}
    </ButtonLink>
    <ButtonLink
      :class="
        currentVote && !currentVote.isPositive ? 'vote-negative' : 'vote-none'
      "
      align="none"
      plain
      customColors
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
import Guid from "guid";
import ButtonLink from "./ButtonLink";
import Icon from "./Icon";

export default {
  name: "IdeaVote",
  components: { ButtonLink, Icon },
  props: {
    ideaId: [String, Guid]
  },
  data() {
    return {
      transitionsList: new EntityTransitionsList()
    };
  },
  computed: {
    ...mapState(["userId"]),
    ...mapGetters(["verifiedEmail"]),
    allVotes() {
      // noinspection JSUnresolvedVariable
      return this.transitionsList
        .getTableData("ideavote")
        .getRowsByFieldValue("ideaId", this.ideaId);
    },
    currentVote() {
      return this.allVotes.getRowByFieldValue("userId", this.userId);
    }
  },
  methods: {
    getVotesByIsPositive(isPositive) {
      return this.allVotes.getRowsByFieldValue("isPositive", isPositive);
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
            "ideavote",
            {
              ideaId: this.ideaId,
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

.idea-vote {
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
