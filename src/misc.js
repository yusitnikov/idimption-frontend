import Guid from "guid";
import InputValidation from "./components/InputValidation";

export function getApiUrl(url = "") {
  return process.env.VUE_APP_API_URL + url;
}

export function getKeyCodeByEvent(ev) {
  let code = ev.code;
  if (ev.shiftKey) {
    code = "Shift+" + code;
  }
  if (ev.altKey) {
    code = "Alt+" + code;
  }
  if (ev.ctrlKey) {
    code = "Ctrl+" + code;
  }
  return code;
}

export function timeout(millisecs = 1) {
  return new Promise(resolve => {
    setTimeout(resolve, millisecs);
  });
}

export function wrapInput(component) {
  const {
    inheritAttrs = false,
    components = {},
    props = {},
    data = () => ({}),
    computed = {},
    methods = {},
    ...otherComponentFields
  } = component;

  const {
    focus = () => {},
    blur = () => {},
    reset = () => {},
    validate = () => true,
    onFocus = () => {},
    onBlur = () => {},
    ...otherMethods
  } = methods;

  return {
    inheritAttrs,
    components: {
      ...components,
      InputValidation
    },
    props: {
      ...props,
      value: [String, Number, Guid],
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
        ...data.apply(this, arguments),
        showValidationMessage: false
      };
    },
    computed: {
      ...computed,
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
      ...otherMethods,
      focus() {
        this.$refs.input.focus();
        return focus.apply(this, arguments);
      },
      blur() {
        this.$refs.input.blur();
        return blur.apply(this, arguments);
      },
      reset() {
        this.showValidationMessage = false;
        return reset.apply(this, arguments);
      },
      validate() {
        if (
          !validate.apply(this, arguments) ||
          this.computedValidationMessage
        ) {
          this.showValidationMessage = true;
          this.focus();
          return false;
        } else {
          return true;
        }
      },
      onFocus() {
        this.$emit("focus");
        return onFocus.apply(this, arguments);
      },
      onBlur() {
        this.showValidationMessage = true;
        this.$emit("blur");
        return onBlur.apply(this, arguments);
      }
    },
    ...otherComponentFields
  };
}

function _getAllInputs(component, resultsArray) {
  if (component.implementsInputInterface) {
    resultsArray.push(component);
  }
  for (const child of component.$children || []) {
    _getAllInputs(child, resultsArray);
  }
}

export function getAllInputs(form) {
  const results = [];
  _getAllInputs(form, results);
  return results;
}

export async function focusFirstInput(form) {
  await timeout();
  const input = getAllInputs(form)[0];
  if (input) {
    input.focus();
  }
}

export function resetAllInputs(form) {
  for (const input of getAllInputs(form)) {
    input.reset();
  }
}

export function validateAllInputs(form) {
  for (const input of getAllInputs(form)) {
    if (!input.validate()) {
      return false;
    }
  }

  return true;
}
