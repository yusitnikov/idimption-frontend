<template>
  <div></div>
</template>

<script>
import { showNotification, openPopup } from "../storeProxy";
import { getUserId, verifyEmail } from "../auth";

export default {
  name: "AuthByCode",
  data() {
    return {
      loaded: false,
      resent: false
    };
  },
  async created() {
    const { code, resetPassword } = this.$route.params;
    const codeIsOk = await verifyEmail(code);
    if (codeIsOk) {
      showNotification("Email verified successfully.");
      // noinspection JSUnresolvedVariable
      if (resetPassword) {
        this.$router.push("/profile");
        return;
      }
    } else {
      showNotification("This link has been expired.", "error");
      if (!getUserId()) {
        openPopup("reset-password");
      }
    }
    this.$router.push("/");
  }
};
</script>

<style scoped lang="less">
.form {
  max-width: 600px;
}
</style>
