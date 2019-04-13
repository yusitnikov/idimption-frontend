import InputValidation from "../components/inputs/InputValidation";

export default {
  inheritAttrs: false,
  components: { InputValidation },
  props: {
    value: {},
    noValidation: Boolean,
    validationMessage: [String, Boolean],
    placeholder: String,
    allowEmpty: Boolean,
    minLength: Number,
    maxLength: Number,
    isEmail: Boolean
  },
  data() {
    return {
      showValidationMessage: false
    };
  },
  computed: {
    implementsInputInterface() {
      return true;
    },
    computedValidationMessage() {
      if (this.noValidation) {
        return "";
      }
      const value = (this.value || "").toString().trim();
      if (value === "") {
        return this.allowEmpty ? "" : "Please enter the field value";
      }
      if (this.minLength && value.length < this.minLength) {
        return "Please input at least " + this.minLength + " characters";
      }
      if (this.maxLength && value.length > this.maxLength) {
        return "Maximum " + this.minLength + " characters allowed";
      }
      if (this.isEmail) {
        // According to the RFC
        const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        if (!emailRegex.test(value)) {
          return "Please input a valid email address";
        }
      }
      return this.validationMessage;
    },
    props() {
      return {
        ...this.$attrs,
        value: this.value,
        placeholder: this.placeholder,
        allowEmpty: this.allowEmpty
      };
    }
  },
  methods: {
    focus() {
      const { input } = this.$refs;
      if (input) {
        input.focus();
      }
    },
    blur() {
      const { input } = this.$refs;
      if (input) {
        input.blur();
      }
    },
    reset() {
      this.showValidationMessage = false;
    },
    validate() {
      if (this.computedValidationMessage) {
        this.showValidationMessage = true;
        this.focus();
        return false;
      } else {
        return true;
      }
    },
    onFocus() {
      this.$emit("focus");
    },
    onBlur() {
      this.showValidationMessage = true;
      this.$emit("blur");
    }
  }
};
