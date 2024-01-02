/* eslint-disable import/order */
import "@/@iconify/icons-bundle";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import { loadFonts } from "@/plugins/webfontloader";
import router from "@/router";
import "@core/scss/template/index.scss";
import "@layouts/styles/index.scss";
import "@styles/styles.scss";
import { createPinia } from "pinia";
import { createApp } from "vue";
import VueGtag from "vue-gtag";
import VueSweetalert2 from "vue-sweetalert2";
import store from "./store";

// If you don't need the styles, do not connect
import "sweetalert2/dist/sweetalert2.min.css";

loadFonts();

// Create vue app
const app = createApp(App);

// Use plugins
app.use(store);
app.use(vuetify);
app.use(createPinia());
app.use(router);
app.use(VueSweetalert2);
app.use(VueGtag, {
  config: { id: "G-SLYJ983W43" },
});

// Mount vue app
app.mount("#app");
