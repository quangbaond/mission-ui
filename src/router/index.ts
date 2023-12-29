import { getStorage } from "@/@common";
import { PROFILE_KEY } from "@/@common/constants";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/tasks" },
    {
      path: "/",
      component: () => import("../layouts/default.vue"),
      children: [
        // {
        //   path: "dashboard",
        //   name: "dashboard",
        //   component: () => import("../pages/dashboard.vue"),
        //   meta: { requiresAuth: true },
        // },
        {
          path: "tasks",
          name: "tasks",
          component: () => import("../pages/task.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "withdraw",
          name: "withdraw",
          component: () => import("../pages/withdraw.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "profile",
          name: "profile",
          component: () => import("../pages/profile.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "introduce",
          name: "introduce",
          component: () => import("../pages/introduce.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/",
      component: () => import("../layouts/blank.vue"),
      children: [
        {
          path: "login",
          name: "login",
          component: () => import("../pages/login.vue"),
        },
        {
          path: "register",
          name: "register",
          component: () => import("../pages/register.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          component: () => import("../pages/[...all].vue"),
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  // instead of having to check every route record with
  // to.matched.some(record => record.meta.requiresAuth)
  const profile = getStorage(PROFILE_KEY);
  console.log(profile);

  if (to.matched.some((record) => record.meta.requiresAuth) && !profile) {
    next({ path: "/login" });
  }

  return next();
});
export default router;
