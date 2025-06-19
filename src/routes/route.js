import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import DashboardLayout from "../pages/layout/DashboardLayout.vue";
import ReportPage from "../pages/report/ReportPage.vue";
import Dashboard from "../pages/report/DashBoard.vue";
import AddMember from "../pages/report/AddMember.vue";
import ReportingPage from "../pages/reporting-system/ReportingPage.vue";

const routes = [
  {
    name: "homeList",
    path: "/",
    component: HomePage,
  },
  {
    path: "/report/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/report/showreport",
        name: "report",
        component: ReportPage,
      },
      {
        path: "/report/addmember",
        name: "member",
        component: AddMember,
      },
    ],
  },
  {
    name: "reporting",
    path: "/reporting",
    component: ReportingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
