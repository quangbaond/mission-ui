import type { ILoginParams, IUser } from "@/interface/user";
import { GET, POST } from "@/service";
import { createLogger } from "vuex";

interface IUserState {
  isLogin: boolean;
  profile: IUser;
}

// Create a new store instance.
const userStore = {
  namespaced: true,
  state(): IUserState {
    return {
      isLogin: false,
      profile: {
        id: 0,
        name: "",
        email: "",
      },
    };
  },
  actions: {
    async login({ commit }: { commit: any }, params: ILoginParams) {
      const res = await POST("/auth/login", params);
      console.log(res.data.data);

      if (res.status) {
        commit("setLogin", true);
        commit("setProfile", res.data.data);
      }

      return res;
    },

    async logout({ commit }: { commit: any }) {
      commit("setLogin", false);
      commit("setProfile", {
        id: 0,
        name: "",
        email: "",
      });
    },

    async register({ commit }: { commit: any }, params: ILoginParams) {
      const res = await POST("/auth/register", params);
      console.log(res.data.data);

      if (res.status) {
        commit("setLogin", true);
        commit("setProfile", res.data.data);
      }

      return res;
    },

    async getProfile({ commit }: { commit: any }) {
      const res = await GET("/v1/profile");
      console.log(res.data.data);

      if (res.status) {
        console.log(res.data?.result);

        commit("setProfile", res.data.result);
      }

      return res;
    },

    async updateProfile({ commit }: { commit: any }, params: IUser) {
      const res = await POST("/v1/profile", params);
      console.log(res.data.data);

      if (res.status) {
        commit("setProfile", res.data.data);
      }

      return res;
    },
  },

  mutations: {
    setLogin(state: IUserState, status: boolean) {
      state.isLogin = status;
    },
    setProfile(state: IUserState, profile: IUser) {
      state.profile = profile;
    },
  },

  plugins: [createLogger()],
};

export default userStore;
