<template>
  <div class="text-input inline-item">
    <input
      :type="type"
      class="input"
      v-bind="props"
      @change="$event => $emit('change', $event.target.value)"
      @input="$event => $emit('input', $event.target.value)"
      @focus="onFocus"
      @blur="onBlur"
      ref="input"
    />

    <InputValidation />
  </div>
</template>

<script>
import InputMixin from "../../mixins/InputMixin";

export default {
  name: "TextInput",
  mixins: [InputMixin],
  props: {
    type: {
      type: String,
      default: "text"
    }
  }
};
</script>
