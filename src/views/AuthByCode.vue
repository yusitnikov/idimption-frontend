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
    const {
      params: { code },
      query: { r }
    } = this.$route;
    const response = await verifyEmail(code);
    if (response) {
      if (response.verifiedNow) {
        showNotification("Email verified successfully.");
      }
      this.$router.push(r || "/");
      return;
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
