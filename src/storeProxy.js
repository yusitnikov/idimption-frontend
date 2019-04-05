import store, {
  SET_USER_ACTION,
  CALL_API_ACTION,
  APPLY_TRANSITIONS_ACTION,
  LOGIN_ACTION,
  REGISTER_ACTION,
  LOGOUT_ACTION,
  SHOW_NOTIFICATION_ACTION,
  HIDE_NOTIFICATION_ACTION,
  OPEN_POPUP_ACTION,
  CLOSE_POPUP_ACTION
} from "./store";

// region Getters

export function getState() {
  // noinspection JSUnresolvedVariable
  return store.state;
}

export function getTableSchema(tableName) {
  return getState().schema[tableName];
}

export function getData() {
  return getState().data;
}

export function getTableData(tableName) {
  return getData()[tableName];
}

export function getDataVersion() {
  return getState().dataVersion;
}

export function getGuids() {
  return getState().guids;
}

// endregion

// region Actions

function callAction(actionName, actionArgs) {
  // noinspection JSUnresolvedFunction
  return store.dispatch(actionName, actionArgs);
}

export function setUser(userId) {
  return callAction(SET_USER_ACTION, userId);
}

export function callApi(
  url,
  formData = {},
  returnsData = false,
  onUploadProgress = null
) {
  return callAction(CALL_API_ACTION, {
    url,
    formData,
    returnsData,
    onUploadProgress
  });
}

export function applyTransitions(transitionsList, showProgress = true) {
  return callAction(APPLY_TRANSITIONS_ACTION, {
    transitionsList,
    showProgress
  });
}

export function login(userId, password) {
  return callAction(LOGIN_ACTION, { userId, password });
}

export function register(userId, password, name) {
  return callAction(REGISTER_ACTION, { userId, password, name });
}

export function logout() {
  return callAction(LOGOUT_ACTION);
}

export function showNotification(message, type = "success") {
  return callAction(SHOW_NOTIFICATION_ACTION, { message, type });
}

export function hideNotification(id) {
  return callAction(HIDE_NOTIFICATION_ACTION, { id });
}

function _openPopup(action, text, saveCallback, cancelCallback) {
  return callAction(OPEN_POPUP_ACTION, {
    action,
    text,
    saveCallback,
    cancelCallback
  });
}

export function openPopup(action, text = "") {
  return new Promise(resolve => {
    _openPopup(action, text, () => resolve(true), () => resolve(false));
  });
}

export function switchPopupAction(action) {
  const { popupText, popupSaveCallback, popupCancelCallback } = getState();
  return _openPopup(action, popupText, popupSaveCallback, popupCancelCallback);
}

export function closePopup() {
  return callAction(CLOSE_POPUP_ACTION);
}

// endregion
