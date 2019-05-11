export default {
  computed: {
    routeQuery: {
      get() {
        return this.$route.query;
      },
      set(value) {
        this.$router.replace({ query: value });
      }
    }
  }
};
