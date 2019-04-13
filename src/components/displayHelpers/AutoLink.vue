<template>
  <span class="auto-link">
    <component
      v-for="(row, index) in parts"
      :key="index"
      :is="row.isLink ? 'a' : 'span'"
      :href="row.isLink ? row.text : undefined"
      :target="row.isLink ? '_blank' : undefined"
      v-text="row.text"
    />
  </span>
</template>

<script>
export default {
  name: "AutoLink",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  computed: {
    parts() {
      const regex = /(https?:\/\/\S+[\w/#])/i;
      return this.text
        .split(regex)
        .filter(text => text !== "")
        .map(text => ({
          text,
          isLink: regex.test(text)
        }));
    }
  }
};
</script>
