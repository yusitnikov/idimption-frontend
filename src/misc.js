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
    startIndex += searchWord.length;
  }
  return true;
}

export function highlightFreeTextSearch(value, searchPhrase) {
  const originalValue = value;
  const fallbackResult = [{ text: value }];

  if (!searchPhrase) {
    return fallbackResult;
  }
  if (!value) {
    return fallbackResult;
  }

  // ignore case and extra space characters
  value = value.trim().toLowerCase();
  searchPhrase = searchPhrase.trim().toLowerCase();

  // check again for empty values after trimming
  if (!searchPhrase) {
    return fallbackResult;
  }
  if (!value) {
    return fallbackResult;
  }

  let result = [];
  let startIndex = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let tmpResult = [];
    let tmpStartIndex = startIndex;
    for (const searchWord of searchPhrase.split(/\s+/)) {
      const newIndex = value.indexOf(searchWord, tmpStartIndex);
      if (newIndex < 0) {
        result.push({ text: originalValue.substr(startIndex) });
        return result;
      }
      tmpResult.push({
        text: originalValue.substring(tmpStartIndex, newIndex)
      });
      tmpStartIndex = newIndex;
      tmpResult.push({
        text: originalValue.substr(tmpStartIndex, searchWord.length),
        highlighted: true
      });
      tmpStartIndex += searchWord.length;
    }
    result.push(...tmpResult);
    startIndex = tmpStartIndex;
  }
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
