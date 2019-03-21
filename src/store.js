import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import Guid from "guid";
import EntityTransitionsList from "./EntityTransitionsList";

Vue.use(Vuex);

const SET_USER_MUTATION = "SET_USER";
const ADD_LOADER_MUTATION = "ADD_LOADER";
const REMOVE_LOADER_MUTATION = "REMOVE_LOADER";
const SET_SCHEMA_MUTATION = "SET_SCHEMA";
const SET_DATA_MUTATION = "SET_DATA";
const SET_WINDOW_SIZE_MUTATION = "SET_WINDOW_SIZE";

export const SET_USER_ACTION = "SET_USER";
export const CALL_API_ACTION = "ADD_LOADER";
export const FETCH_SCHEMA_ACTION = "FETCH_SCHEMA";
export const FETCH_DATA_ACTION = "FETCH_DATA";
export const APPLY_TRANSITIONS_ACTION = "APPLY_TRANSITIONS";
export const ADD_ROW_ACTION = "ADD_ROW";
export const UPDATE_ROW_ACTION = "UPDATE_ROW";
export const DELETE_ROW_ACTION = "DELETE_ROW";

let loaderAutoIncrementId = 0;

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
    userId: localStorage.userId || null,
    loaders: {},
    schema: null,
    data: null,
    guids: {},
    dataVersion: 0,
    windowSize: getWindowSize()
  },
  getters: {
    loading: state => Object.keys(state.loaders).length !== 0,
    ready: state => state.schema && state.data
  },
  mutations: {
    [SET_USER_MUTATION](state, userId) {
      localStorage.userId = state.userId = userId;
    },
    [ADD_LOADER_MUTATION](state, { id, loader, essential }) {
      Vue.set(state.loaders, id, {
        loader,
        essential
      });
    },
    [REMOVE_LOADER_MUTATION](state, id) {
      Vue.delete(state.loaders, id);
    },
    [SET_SCHEMA_MUTATION](state, schema) {
      state.schema = schema;
    },
    [SET_DATA_MUTATION](state, { data, guids = {} }) {
      console.log("Set data");
      state.data = data;
      state.guids = {
        ...state.guids,
        ...guids
      };
      state.dataVersion = state.dataVersion + 1;
      console.log("Data version is", state.dataVersion);
    },
    [SET_WINDOW_SIZE_MUTATION](state, size) {
      state.windowSize = size;
    }
  },
  actions: {
    [SET_USER_ACTION]({ commit }, userId) {
      commit(SET_USER_MUTATION, userId);
    },
    async [CALL_API_ACTION](
      { state, commit },
      { url, formData = {}, essential, returnsData = true }
    ) {
      const id = ++loaderAutoIncrementId;
      formData.userId = state.userId;
      // noinspection ES6ModulesDependencies, JSUnresolvedVariable
      const loader = axios.post(
        process.env.VUE_APP_API_URL + url,
        JSON.stringify(formData)
      );
      commit(ADD_LOADER_MUTATION, { id, loader, essential });
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
        commit(REMOVE_LOADER_MUTATION, id);
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
          url: "/get-schema.php",
          essential: true,
          returnsData: false
        })
      );
    },
    async [FETCH_DATA_ACTION]({ dispatch }) {
      await dispatch(CALL_API_ACTION, {
        url: "/get-all.php",
        essential: true
      });
    },
    async [APPLY_TRANSITIONS_ACTION]({ dispatch }, transitionsList) {
      await dispatch(CALL_API_ACTION, {
        url: "/save.php",
        formData: {
          transitions: transitionsList.toJSON()
        }
      });
      transitionsList.reset();
    },
    async [ADD_ROW_ACTION]({ dispatch }, { tableName, row }) {
      let transitionsList = new EntityTransitionsList();
      row.id = row.id || Guid.create();
      transitionsList.addRow(tableName, row);
      return dispatch(APPLY_TRANSITIONS_ACTION, transitionsList);
    },
    async [UPDATE_ROW_ACTION]({ dispatch }, { tableName, id, updates }) {
      let transitionsList = new EntityTransitionsList();
      transitionsList.updateRow(tableName, id, updates);
      return dispatch(APPLY_TRANSITIONS_ACTION, transitionsList);
    },
    async [DELETE_ROW_ACTION]({ dispatch }, { tableName, id }) {
      let transitionsList = new EntityTransitionsList();
      transitionsList.deleteRow(tableName, id);
      return dispatch(APPLY_TRANSITIONS_ACTION, transitionsList);
    }
  }
});

// noinspection JSUnresolvedFunction
store.dispatch(FETCH_SCHEMA_ACTION);
// noinspection JSUnresolvedFunction
store.dispatch(FETCH_DATA_ACTION);

export default store;
