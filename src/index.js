import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.css";
import App from "./App.vue"; // 导入 App 组件

Vue.use(Vuetify);

new Vue({
  el: "#app",
  vuetify: new Vuetify({
    icons: {
      iconfont: 'mdi', // 设置默认图标字体为 Material Design Icons
    },
  }),
  render: (h) => h(App) // 使用 App 作为根组件
});
