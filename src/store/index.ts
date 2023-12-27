import { createLogger, createStore } from 'vuex'
import userStore from './user'

// Create a new store instance.
const store = createStore({
  state() {
    return {
      count: 0,
    }
  },
  actions: {

  },
  plugins: [createLogger()],

  // how to use userStore in a store
  modules: {
    userStore,
  },

})

export default store
