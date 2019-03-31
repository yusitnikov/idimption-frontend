import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { getApiUrl, timeout } from "./misc";
// noinspection ES6CheckImport
import { notificationAnimationTimeout } from "./styles/essentials.less";

Vue.use(Vuex);

const SET_READY_MUTATION = "SET_READY";
const SET_USER_MUTATION = "SET_USER";
const ADD_LOADER_MUTATION = "ADD_LOADER";
const REMOVE_LOADER_MUTATION = "REMOVE_LOADER";
const SET_SCHEMA_MUTATION = "SET_SCHEMA";
const SET_DATA_MUTATION = "SET_DATA";
const SET_WINDOW_SIZE_MUTATION = "SET_WINDOW_SIZE";
const ADD_NOTIFICATION_MUTATION = "ADD_NOTIFICATION";
const SHOW_NOTIFICATION_MUTATION = "SHOW_NOTIFICATION";
const REMOVE_NOTIFICATION_MUTATION = "REMOVE_NOTIFICATION";
const SET_POPUP_PARAMS_MUTATION = "SET_POPUP_PARAMS";

export const INIT_APP_ACTION = "INIT_APP";
export const SET_USER_ACTION = "SET_USER";
export const CALL_API_ACTION = "ADD_LOADER";
export const FETCH_SCHEMA_ACTION = "FETCH_SCHEMA";
export const FETCH_DATA_ACTION = "FETCH_DATA";
export const APPLY_TRANSITIONS_ACTION = "APPLY_TRANSITIONS";
export const CHECK_AUTH_ACTION = "CHECK_AUTH";
export const LOGIN_ACTION = "LOGIN";
export const REGISTER_ACTION = "REGISTER";
export const LOGOUT_ACTION = "LOGOUT";
export const SHOW_NOTIFICATION_ACTION = "SHOW_NOTIFICATION";
export const HIDE_NOTIFICATION_ACTION = "HIDE_NOTIFICATION";
export const OPEN_POPUP_ACTION = "OPEN_POPUP";
export const CLOSE_POPUP_ACTION = "CLOSE_POPUP";

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

window.addEventListener("resize", () => {
  // noinspection JSUnresolvedFunction
  store.commit(SET_WINDOW_SIZE_MUTATION, getWindowSize());
});

// noinspection JSValidateTypes
const store = new Vuex.Store({
  state: {
    ready: false,
    userId: null,
    notificationAutoIncrementId: 0,
    notifications: [],
    popupAction: null,
    popupText: null,
    popupSaveCallback: null,
    popupCancelCallback: null,
    loaderAutoIncrementId: 0,
    loaders: {},
    schema: null,
    data: null,
    guids: {},
    dataVersion: 0,
    windowSize: getWindowSize()
  },
  getters: {
    loading: state => Object.keys(state.loaders).length !== 0,
    visibleNotifications: state => state.notifications.filter(n => n),
    verifiedEmail: () => {
      const { isUserVerified } = require("./auth");
      return isUserVerified();
    }
  },
  mutations: {
    [SET_READY_MUTATION](state) {
      state.ready = true;
    },
    [SET_USER_MUTATION](state, userId) {
      state.userId = userId;
    },
    [ADD_LOADER_MUTATION](state, loader) {
      state.loaderAutoIncrementId = state.loaderAutoIncrementId + 1;
      Vue.set(state.loaders, state.loaderAutoIncrementId, { loader });
    },
    [REMOVE_LOADER_MUTATION](state, id) {
      Vue.delete(state.loaders, id);
    },
    [SET_SCHEMA_MUTATION](state, schema) {
      state.schema = schema;
    },
    [SET_DATA_MUTATION](state, { data, guids = {} }) {
      state.data = data;
      state.guids = {
        ...state.guids,
        ...guids
      };
      // don't use increment operator, cause the reactivity system needs explicit assignment
      state.dataVersion = state.dataVersion + 1;
    },
    [SET_WINDOW_SIZE_MUTATION](state, size) {
      state.windowSize = size;
    },
    [ADD_NOTIFICATION_MUTATION](state, { message, type = "success" }) {
      state.notificationAutoIncrementId = state.notificationAutoIncrementId + 1;
      state.notifications.unshift({
        id: state.notificationAutoIncrementId,
        message,
        type,
        visible: false
      });
    },
    [SHOW_NOTIFICATION_MUTATION](state, { id, visible = true }) {
      for (let notification of state.notifications) {
        if (notification.id === id) {
          notification.visible = visible;
        }
      }
    },
    [REMOVE_NOTIFICATION_MUTATION](state, id) {
      state.notifications = state.notifications.filter(
        notification => notification.id !== id
      );
    },
    [SET_POPUP_PARAMS_MUTATION](
      state,
      { action, text = "", saveCallback, cancelCallback }
    ) {
      state.popupAction = action;
      state.popupText = text;
      state.popupSaveCallback = saveCallback;
      state.popupCancelCallback = cancelCallback;
    }
  },
  actions: {
    async [INIT_APP_ACTION]({ commit, dispatch }) {
      await Promise.all([
        dispatch(FETCH_SCHEMA_ACTION),
        dispatch(FETCH_DATA_ACTION),
        dispatch(CHECK_AUTH_ACTION)
      ]);
      commit(SET_READY_MUTATION);
    },
    [SET_USER_ACTION]({ commit }, userId) {
      commit(SET_USER_MUTATION, userId);
    },
    async [CALL_API_ACTION](
      { state, commit },
      { url, formData = {}, returnsData = false, onUploadProgress = null }
    ) {
      const showProgress = !onUploadProgress;
      let xhrConfig = {
        withCredentials: true
      };
      if (formData instanceof FormData) {
        xhrConfig.headers = {
          "Content-Type": "multipart/form-data"
        };
        if (onUploadProgress) {
          xhrConfig.onUploadProgress = onUploadProgress;
        }
      } else {
        formData = JSON.stringify(formData);
      }
      const loader = axios.post(getApiUrl(url), formData, xhrConfig);
      let id = null;
      if (showProgress) {
        commit(ADD_LOADER_MUTATION, loader);
        id = state.loaderAutoIncrementId;
      }
      let response;
      try {
        response = (await loader).data;
      } catch (e) {
        response = {
          success: false,
          error: {
            code: 500,
            message: e
          }
        };
      } finally {
        if (showProgress) {
          commit(REMOVE_LOADER_MUTATION, id);
        }
      }

      if (response.success) {
        if (returnsData) {
          commit(SET_DATA_MUTATION, response.result);
        }
        return response.result;
      } else {
        throw response.error;
      }
    },
    async [FETCH_SCHEMA_ACTION]({ commit, dispatch }) {
      commit(
        SET_SCHEMA_MUTATION,
        await dispatch(CALL_API_ACTION, {
          url: "/get-schema.php"
        })
      );
    },
    async [FETCH_DATA_ACTION]({ dispatch }) {
      await dispatch(CALL_API_ACTION, {
        url: "/get-all.php",
        returnsData: true
      });
    },
    async [APPLY_TRANSITIONS_ACTION]({ state, dispatch }, transitionsList) {
      if (transitionsList.isEmpty()) {
        return;
      }
      if (!state.userId) {
        const { openPopup } = require("./storeProxy");
        await openPopup(
          "login",
          "Warning: you are not logged in!\n" +
            "You still may submit this data as a guest, but you won't be able to edit it later."
        );
      }
      await dispatch(CALL_API_ACTION, {
        url: "/save.php",
        formData: {
          transitions: transitionsList.toJSON()
        },
        returnsData: true
      });
      transitionsList.reset();
    },
    async [CHECK_AUTH_ACTION]({ commit, dispatch }) {
      commit(
        SET_USER_MUTATION,
        await dispatch(CALL_API_ACTION, {
          url: "/auth/check.php"
        })
      );
    },
    async [LOGIN_ACTION]({ commit, dispatch }, { userId, password }) {
      await dispatch(CALL_API_ACTION, {
        url: "/auth/login.php",
        formData: {
          userId,
          password
        }
      });
      commit(SET_USER_MUTATION, userId);
    },
    async [REGISTER_ACTION]({ commit, dispatch }, { userId, password, name }) {
      await dispatch(CALL_API_ACTION, {
        url: "/auth/register.php",
        formData: {
          userId,
          password,
          name
        },
        returnsData: true
      });
      commit(SET_USER_MUTATION, userId);
    },
    [LOGOUT_ACTION]({ commit, dispatch }) {
      commit(SET_USER_MUTATION, null);
      dispatch(CALL_API_ACTION, {
        url: "/auth/logout.php"
      });
    },
    [SHOW_NOTIFICATION_ACTION](
      { state, commit },
      { message, type = "success" }
    ) {
      commit(ADD_NOTIFICATION_MUTATION, { message, type });
      const id = state.notificationAutoIncrementId;
      timeout().then(() => {
        commit(SHOW_NOTIFICATION_MUTATION, { id });
      });
      return id;
    },
    [HIDE_NOTIFICATION_ACTION]({ commit }, { id }) {
      commit(SHOW_NOTIFICATION_MUTATION, { id, visible: false });
      timeout(notificationAnimationTimeout).then(() => {
        commit(REMOVE_NOTIFICATION_MUTATION, id);
      });
      return id;
    },
    [OPEN_POPUP_ACTION](
      { commit },
      { action, text = "", saveCallback, cancelCallback }
    ) {
      commit(SET_POPUP_PARAMS_MUTATION, {
        action,
        text,
        saveCallback,
        cancelCallback
      });
    },
    [CLOSE_POPUP_ACTION]({ commit }) {
      commit(SET_POPUP_PARAMS_MUTATION, {
        action: null,
        text: null,
        saveCallback: null,
        cancelCallback: null
      });
    }
  }
});

// noinspection JSUnresolvedFunction
store.dispatch(INIT_APP_ACTION);

export default store;
