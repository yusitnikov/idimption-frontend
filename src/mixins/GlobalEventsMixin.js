// noinspection JSUnusedGlobalSymbols
export default {
  props: {
    ignoreEvents: Boolean
  },
  mounted() {
    this.onGlobalClick = this.onGlobalClick.bind(this);
    this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this);
    document.addEventListener("click", this.onGlobalClick);
    document.addEventListener("keydown", this.onGlobalKeyDown);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.onGlobalClick);
    document.removeEventListener("keydown", this.onGlobalKeyDown);
  },
  methods: {
    onGlobalClick(ev) {
      if (!this.ignoreEvents && !this.$el.contains(ev.target)) {
        this.onOuterClick(ev);
      }
    },
    onGlobalKeyDown(ev) {
      if (!this.ignoreEvents) {
        this.onKeyDown(ev);
      }
    },
    onOuterClick() {
      // the component to override it if necessary
    },
    onKeyDown() {
      // the component to override it if necessary
    }
  }
};
