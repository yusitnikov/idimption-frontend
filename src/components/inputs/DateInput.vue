<template>
  <div class="date-input inline-item">
    <Datepicker
      v-bind="props"
      @input="$event => $emit('input', $event)"
      inputClass="input picker-input"
      calendarClass="select-popup picker-popup"
      :clearButton="allowEmpty"
      clearButtonIcon="fas fa-times"
      :disabledDates="disabledDates"
    />

    <InputValidation />
  </div>
</template>

<script>
import InputMixin from "../../mixins/InputMixin";
import Datepicker from "vuejs-datepicker";

export default {
  name: "DateInput",
  components: { Datepicker },
  mixins: [InputMixin],
  props: {
    allowFutureDates: Boolean
  },
  computed: {
    disabledDates() {
      let disabledDates = {};
      if (!this.allowFutureDates) {
        disabledDates.from = new Date();
      }
      return disabledDates;
    }
  }
};
</script>

<style lang="less">
@import "../../styles/essentials";

.date-input {
  @clear-button-width: 10px;
  @clear-button-padding: (@input-full-height - @clear-button-width) / 2;

  .vdp-datepicker__clear-button {
    position: absolute;
    right: @clear-button-padding + 1px;
    top: 0;
    bottom: 0;
    line-height: @button-full-height;
  }

  .picker-popup {
    .basic-block(10px, ignore);
  }
}
</style>
