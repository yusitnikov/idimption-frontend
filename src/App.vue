<template>
  <div id="app" :class="{ loaded: !loading }">
    <div id="notifications" v-if="notifications.length">
      <Alert
        v-for="notification in notifications"
        :type="notification.type"
        :class="[
          'notification',
          notification.visible ? 'notification-visible' : 'notification-hidden'
        ]"
        allowClose
        :style="{ top: notification.top }"
        @close="() => hideNotification(notification.id)"
        :key="notification.id"
      >
        {{ notification.message }}
      </Alert>
    </div>

    <template v-if="ready">
      <div id="nav">
        <div id="auth" class="pull-right">
          Welcome,
          <EntityById tableName="user" :id="userId" v-slot="{ displayText }">
            {{ displayText || "Guest" }}
          </EntityById>
          <Button @click="openLogin" v-if="!userId">
            <Icon type="sign-in-alt" />
            Login
          </Button>
          <Button @click="doLogout" v-if="userId">
            <Icon type="sign-out-alt" />
            Logout
          </Button>
        </div>

        <router-link to="/idea">Ideas</router-link>
        |
        <router-link to="/category">Categories</router-link>
        <template v-if="userId">
          |
          <router-link to="/profile">My Profile</router-link>
        </template>
      </div>

      <Alert type="warning" v-if="userId && !verifiedEmail">
        <template v-if="!verificationEmailSent">
          Please verify your email.
          <Button @click="sendVerificationEmail">
            Send verification code
          </Button>
        </template>
        <template v-else>
          Verification code sent, please check your email.
        </template>
      </Alert>

      <router-view />

      <PopupForm
        title="Login"
        :priority="1000"
        @save="doLogin"
        @close="cancelPopup"
        v-if="popupAction === 'login'"
      >
        <!-- eslint-disable-next-line -->
        <div class="line multi-line first-section" v-if="popupText">{{ popupText }}</div>

        <FormRow label="Login (email)">
          <TextInput
            v-model="popupUserId"
            @input="resetPopupError"
            isEmail
            key="login"
          />
        </FormRow>
        <FormRow label="Password">
          <TextInput
            type="password"
            v-model="popupPassword"
            @input="resetPopupError"
            :validationMessage="popupError"
            key="password"
          />
        </FormRow>

        <div class="line next-section-start">
          Don't have an account yet?
          <Button @click="switchToRegister">Register</Button>
        </div>

        <div class="line next-section-start">
          Forgot password?
          <Button @click="switchToResetPassword">Restore</Button>
        </div>
      </PopupForm>

      <PopupForm
        title="Register"
        :priority="1000"
        @save="doRegister"
        @close="cancelPopup"
        v-if="popupAction === 'register'"
      >
        <!-- eslint-disable-next-line -->
        <div class="line multi-line first-section" v-if="popupText">{{ popupText }}</div>

        <FormRow label="Name">
          <TextInput v-model="popupUserName" @input="resetPopupError" />
        </FormRow>
        <FormRow label="Login (email)">
          <TextInput
            v-model="popupUserId"
            @input="resetPopupError"
            isEmail
            key="login"
          />
        </FormRow>
        <FormRow label="Password">
          <TextInput
            type="password"
            v-model="popupPassword"
            @input="resetPopupError"
            :validationMessage="popupError"
            key="password"
          />
        </FormRow>

        <div class="line next-section-start">
          Already have an account?
          <Button @click="switchToLogin">Login</Button>
        </div>
      </PopupForm>

      <PopupForm
        title="Restore password"
        :priority="1000"
        @save="doResetPassword"
        @close="cancelPopup"
        v-if="popupAction === 'reset-password'"
      >
        <!-- eslint-disable-next-line -->
        <div class="line multi-line first-section" v-if="popupText">{{ popupText }}</div>

        <FormRow label="Login (email)">
          <TextInput
            v-model="popupUserId"
            @input="resetPopupError"
            isEmail
            :validationMessage="popupError"
            key="login"
          />
        </FormRow>
      </PopupForm>
    </template>

    <portal-target name="popups" multiple />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  login,
  register,
  logout,
  showNotification,
  hideNotification,
  openPopup,
  switchPopupAction,
  closePopup
} from "./storeProxy";
import { sendVerificationEmail } from "./auth";
import Icon from "./components/Icon";
import Alert from "./components/Alert";
import EntityById from "./components/EntityById";
import Button from "./components/Button";
import PopupForm from "./components/PopupForm";
import FormRow from "./components/FormRow";
import TextInput from "./components/TextInput";
// noinspection ES6CheckImport
import {
  bodyMargin,
  oneLineBlockHeight,
  blockMargin
} from "./styles/essentials.less";

export default {
  name: "App",
  components: {
    Icon,
    Alert,
    EntityById,
    Button,
    PopupForm,
    FormRow,
    TextInput
  },
  data() {
    return {
      verificationEmailSent: false,
      popupError: "",
      popupUserId: "",
      popupPassword: "",
      popupUserName: ""
    };
  },
  computed: {
    ...mapState([
      "ready",
      "userId",
      "popupAction",
      "popupText",
      "popupSaveCallback",
      "popupCancelCallback"
    ]),
    ...mapGetters(["loading", "visibleNotifications", "verifiedEmail"]),
    notifications() {
      let index = 0;
      let notifications = [];
      for (const notification of this.visibleNotifications) {
        if (!notification.visible) {
          --index;
        }
        notifications.push({
          ...notification,
          top:
            Number(bodyMargin) +
            (Number(oneLineBlockHeight) + Number(blockMargin)) * index +
            "px"
        });
        ++index;
      }
      return notifications;
    }
  },
  methods: {
    resetPopup() {
      this.popupError = "";
      this.popupUserId = "";
      this.popupPassword = "";
      this.popupUserName = "";
    },
    resetPopupError() {
      this.popupError = "";
    },
    switchPopupAction(action) {
      this.resetPopup();
      switchPopupAction(action);
    },
    openLogin() {
      openPopup("login");
    },
    switchToRegister() {
      this.switchPopupAction("register");
    },
    switchToLogin() {
      this.switchPopupAction("login");
    },
    switchToResetPassword() {
      this.switchPopupAction("reset-password");
    },
    async doLogin() {
      try {
        await login(this.popupUserId, this.popupPassword);
        this.verificationEmailSent = false;
        this.savePopupIfVerified();
      } catch (exception) {
        this.popupError = exception.message;
      }
    },
    async doRegister() {
      try {
        await register(
          this.popupUserId,
          this.popupPassword,
          this.popupUserName
        );
        // Don't call savePopup(), cause still not verified the email
        this.cancelPopup();
        this.verificationEmailSent = true;
      } catch (exception) {
        this.popupError = exception.message;
      }
    },
    doLogout() {
      logout();
      this.verificationEmailSent = false;
      this.$router.push("/");
    },
    async doResetPassword() {
      try {
        await sendVerificationEmail(this.popupUserId, true);
        // Don't call savePopup(), cause still not logged in
        this.cancelPopup();
        showNotification("Verification code sent, please check your email.");
      } catch (exception) {
        this.popupError = exception.message;
      }
    },
    sendVerificationEmail() {
      sendVerificationEmail(this.userId, false);
      this.verificationEmailSent = true;
    },
    async savePopupIfVerified() {
      await this.$nextTick();
      if (this.verifiedEmail) {
        this.savePopup();
      } else {
        this.cancelPopup();
      }
    },
    savePopup() {
      if (this.popupSaveCallback) {
        this.popupSaveCallback();
      }
      this.closePopup();
    },
    cancelPopup() {
      if (this.popupCancelCallback) {
        this.popupCancelCallback();
      }
      this.closePopup();
    },
    closePopup() {
      closePopup();
      this.resetPopup();
    },
    hideNotification
  }
};
</script>

<style lang="less">
@import "assets/fontawesome/less/fontawesome";
@import "assets/fontawesome/less/solid";
@import "styles/essentials";

#app {
  .fullscreen(0);
  overflow: auto;

  padding: @body-margin;
}

body,
input,
textarea,
select,
button {
  font-size: @font-size;
  line-height: @line-height;
}

#notifications .alert.notification {
  position: fixed;
  z-index: @z-index-notifications;
  right: @body-margin;
  margin: 0;
  transition: all @notification-animation-timeout;

  &.notification-hidden {
    opacity: 0;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-active {
      color: #42b983;
    }
  }
}

.block {
  .basic-block(@block-padding);
  .block-margin;
}

.inline {
  display: inline !important;
  .inline-align-modifiers;
}

.inline-block {
  display: inline-block !important;
  .inline-align-modifiers;
}

.line {
  margin-bottom: @paragraph-margin;
}

.next-section-start {
  margin-top: @section-margin;
}

.first-section {
  margin-bottom: @section-margin;
}

.select-popup {
  margin-top: 2px;
}

.input {
  .basic-block(@input-padding);

  outline: none;

  &.button {
    width: auto;
    min-width: @button-full-height;
    .color-with-hover(#ddd, background);

    &:disabled {
      background: #fff;
      opacity: 0.7;
    }

    &.small {
      padding-left: @input-vertical-padding;
      padding-right: @input-vertical-padding;
    }
  }
}

.button {
  .inline-align-modifiers;
}

.single-line {
  white-space: nowrap;
}

.multi-line {
  white-space: pre-wrap;
}

.irrelevant {
  opacity: 0.5;
}

.highlighted {
  background: yellow;
}

.pull-right {
  float: right;
}
</style>
