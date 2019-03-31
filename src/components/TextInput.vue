<template>
  <div class="text-input">
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
import { wrapInput } from "../misc";

export default wrapInput({
  name: "TextInput",
  props: {
    type: {
      type: String,
      default: "text"
    }
  }
});
</script>
