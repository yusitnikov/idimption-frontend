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
