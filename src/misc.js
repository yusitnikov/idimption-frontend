export function toArray(value) {
  if (value instanceof Array) {
    return value;
  } else if (value === undefined) {
    return [];
  } else {
    return [value];
  }
}

export function formatDate(dt) {
  return dt ? dt.toISOString().substr(0, 10) : null;
}

export function matchesFreeTextSearch(value, searchPhrase) {
  if (!searchPhrase) {
    return true;
  }
  if (!value) {
    return false;
  }

  // ignore case and extra space characters
  value = value.trim().toLowerCase();
  searchPhrase = searchPhrase.trim().toLowerCase();

  // check again for empty values after trimming
  if (!searchPhrase) {
    return true;
  }
  if (!value) {
    return false;
  }

  let startIndex = 0;
  for (const searchWord of searchPhrase.split(/\s+/)) {
    startIndex = value.indexOf(searchWord, startIndex);
    if (startIndex < 0) {
      return false;
    }
    startIndex += searchWord.length + 1;
  }
  return true;
}

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
