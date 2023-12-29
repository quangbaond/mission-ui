import { createLogger, createStore } from "vuex";
import userStore from "./user";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      loading: false,
    };
  },
  actions: {
    setLoading({ commit }: { commit: any }, params: boolean) {
      commit("setLoading", params);
    },
  },
  mutations: {
    setLoading(state: any, params: boolean) {
      state.loading = params;
    },
  },
  plugins: [createLogger()],

  // how to use userStore in a store
  modules: {
    userStore,
  },
});

export default store;
