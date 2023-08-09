import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
// import 'roboto-fontface/css/roboto/roboto-fontface.css';
import router from "./routes"
import App from "./App.vue"; 

Vue.use(Vuetify);


new Vue({
  el: "#app",
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi',
    },
  }),
   router,
  render: (h) => h(App)
});