<template>
  <div class="entity-subscription-icon">
    <ButtonLink
      :class="currentIncludedClass"
      align="none"
      plain
      customColors
      :title="title"
      @click="event => toggle(event, true)"
    >
      <Icon :type="currentIncluded === false ? 'eye-slash' : 'eye'" />
      {{ positiveSubscriptions.length }}
    </ButtonLink>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { openPopup } from "../storeProxy";
import EntityTransitionsList from "../EntityTransitionsList";
import { TableData } from "../TableData";
import { EntityRow } from "../EntityRow";
import { getRowById } from "../EntityHelper";
import ButtonLink from "./ButtonLink";
import Icon from "./Icon";

export default {
  name: "EntitySubscriptionIcon",
  components: { ButtonLink, Icon },
  props: {
    row: {
      type: EntityRow,
      required: true
    },
    transitionsList: {
      type: EntityTransitionsList,
      required: true
    }
  },
  computed: {
    ...mapState(["userId"]),
    foreignTableName() {
      return this.row.tableName + "subscription";
    },
    foreignFieldName() {
      return this.row.tableName + "Id";
    },
    allUsers() {
      return this.transitionsList.getTableData("user");
    },
    currentData() {
      return this.transitionsList.getTableData(this.row.tableName);
    },
    foreignData() {
      return this.transitionsList.getTableData(this.foreignTableName);
    },
    allSubscriptions() {
      return new TableData(
        this.allUsers.map(user => {
          const userForeignData = this.foreignData.getRowsByFieldValue(
            "userId",
            user.id
          );

          const currentSubscription = userForeignData.getRowByFieldValue(
            this.foreignFieldName,
            this.row.id
          );
          const currentIncluded = currentSubscription
            ? currentSubscription.included
            : null;

          let parentIncluded = null;
          for (
            let parent = this.row.getParent(this.currentData);
            parent;
            parent = parent.getParent(this.currentData)
          ) {
            const parentSubscription = userForeignData.getRowByFieldValue(
              this.foreignFieldName,
              parent.id
            );
            if (parentSubscription) {
              parentIncluded = parentSubscription.included;
              break;
            }
          }

          return {
            id: user.id,
            currentSubscription,
            currentIncluded,
            parentIncluded,
            included: currentSubscription ? currentIncluded : parentIncluded
          };
        })
      );
    },
    positiveSubscriptions() {
      return this.allSubscriptions.getRowsByFieldValue("included", true);
    },
    currentSubscription() {
      return (
        this.allSubscriptions.getRowById(this.userId) || {
          id: this.userId,
          currentSubscription: null,
          currentIncluded: null,
          parentIncluded: null,
          included: null
        }
      );
    },
    currentIncluded() {
      return this.currentSubscription.included;
    },
    currentIncludedClass() {
      return this.currentIncluded === null
        ? "subscription-none"
        : this.currentIncluded
        ? "subscription-included"
        : "subscription-excluded";
    },
    title() {
      let title = [];

      if (this.userId) {
        title.push(
          this.currentIncluded === null
            ? "You are not subscribed."
            : this.currentIncluded
            ? "You are subscribed."
            : "You are ignoring."
        );
      }

      const otherSubscribers = this.positiveSubscriptions
        .filter(row => row.id !== this.userId)
        .map(row => getRowById("user", row.id).displayText);
      if (otherSubscribers.length) {
        title.push(
          (title.length ? "Other subscribers:\n" : "") +
            otherSubscribers.join("\n")
        );
      }

      return title.join("\n\n");
    }
  },
  methods: {
    async toggle(event) {
      event.stopPropagation();

      const wasGuest = !this.userId;
      if (wasGuest) {
        await openPopup(
          "login",
          "Sorry, but subscriptions are not available for guests.\nPlease login or register."
        );
        await this.$nextTick();
      }

      if (!this.userId) {
        return;
      }

      const {
        currentSubscription,
        currentIncluded,
        parentIncluded,
        included
      } = this.currentSubscription;

      let newIncluded;
      if (wasGuest) {
        newIncluded = true;
      } else if (included === null) {
        newIncluded = true;
      } else {
        newIncluded = included ? false : null;
      }

      if (newIncluded === null && parentIncluded === null) {
        if (currentSubscription) {
          this.transitionsList.deleteRow(currentSubscription);
        }
      } else if (currentSubscription) {
        if (currentIncluded !== newIncluded) {
          this.transitionsList.updateRow(currentSubscription, {
            included: newIncluded
          });
        }
      } else {
        this.transitionsList.addRow(
          new EntityRow(
            this.foreignTableName,
            {
              [this.foreignFieldName]: this.row.id,
              userId: this.userId,
              included: newIncluded
            },
            true
          )
        );
      }

      this.transitionsList.save(false);
    }
  }
};
</script>

<style lang="less">
@import "../styles/essentials";

.entity-subscription-icon {
  display: inline;
  font-weight: normal;

  .subscription-none .link {
    .color-with-hover(#ccc);
  }

  .subscription-included .link {
    .color-with-hover(@success-color);
  }

  .subscription-excluded .link {
    .color-with-hover(@error-color);
  }
}
</style>
