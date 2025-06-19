import { createRouter, createWebHistory } from 'vue-router';
// import HomePage from "../pages/HomePage.vue";
import Dashboard from '../pages/layout/Dashboard.vue';
import ReportPage from '../pages/report/ReportPage.vue';
import DashBoard from '../pages/report/DashBoard.vue';
import AddMember from '../pages/report/AddMember.vue';
import ReportingPage from '../pages/reporting-system/ReportingPage.vue';
import Login from '../components/authentication/Login.vue';
import AuthPage from '../pages/authentication/Auth.vue';

const routes = [
  {
    name: 'login',
    path: '/',
    component: AuthPage,
  },
  // {
  //   name: "homeList",
  //   path: "/",
  //   component: HomePage,
  // },
  {
    path: '/report/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'dashoard',
        component: DashBoard,
      },
      {
        path: '/report/showreport',
        name: 'report',
        component: ReportPage,
      },
      {
        path: '/report/addmember',
        name: 'member',
        component: AddMember,
      },
    ],
  },
  {
    name: 'reporting',
    path: '/reporting',
    component: ReportingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
