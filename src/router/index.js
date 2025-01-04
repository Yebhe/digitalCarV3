import { createRouter, createWebHistory } from "vue-router";
import SignupView from "@/views/SignupView.vue";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import HomeView from "@/views/HomeView.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import FormAddPdf from "@/views/FormAddPdf.vue";
import BrandCrud from "@/views/BrandCrud.vue";
import ModelCrud from "../views/ModelCrud.vue";
import AdasCrud from "../views/AdasCrud.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/signup", component: SignupView },
  { path: "/login", component: LoginView },
  { path: "/forgot-password", component: ResetPassword },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/upload-pdf",
    component: FormAddPdf,
    meta: { requiresAuth: true },
  },
  {
    path: "/brands",
    component: BrandCrud,
    meta: { requiresAuth: true },
  },
  {
    path: "/models",
    component: ModelCrud,
    meta: { requiresAuth: true },
  },
  {
    path: "/adas-component",
    component: AdasCrud,
    meta: { requiresAuth: true },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Garde de navigation
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("Redirecting to login because not authenticated");
    next("/login");
  } else {
    next();
  }
});
export default router;
