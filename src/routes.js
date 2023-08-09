import Vue from 'vue'
import Router from 'vue-router'
import HomePage from "./pages/HomePage.vue";
import Products from './pages/Products.vue'
import NotFound from './pages/NotFound.vue'
import CheckOut from './pages/CheckOut.vue'
import OrderCompelet from './pages/OrderCompelet.vue'
import A from './pages/A.vue'
import B from './pages/B.vue'
Vue.use(Router)

const routes = [
  {
    path: "/shop",
    name: "home",
    component: HomePage,
  },
  {
    path: "/shop/products",
    name: "products",
    component: Products
  },
  {
    path: "/shop/CheckOut",
    name: "CheckOut",
    component: CheckOut
  },
  {
    path: "/shop/OrderCompelet",
    name: "OrderCompelet",
    component: OrderCompelet,
    props: true
  },
  {
    path: "/shop/A",
    name: "A",
    component: A,
    props: true
  },
  {
    path: "/shop/B",
    name: "B",
    component: B,
    props: true
  },
  {
    path: "/shop/*",
    component: NotFound
  }
];

const router = new Router({
  mode: 'history',
  routes: routes
});

export default router;
