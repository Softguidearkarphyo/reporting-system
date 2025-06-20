import { createRouter, createWebHistory } from 'vue-router';
// import HomePage from "../pages/HomePage.vue";
import Dashboard from '../pages/layout/Dashboard.vue';
import ReportPage from '../pages/report/ReportPage.vue';
import DashBoard from '../pages/report/DashBoard.vue';
import AddMember from '../pages/report/AddMember.vue';
import WorkingTime from '../pages/report/WorkingTime.vue';
import MemberReport from '../pages/report/MemberReport.vue';
import MenPower from '../pages/report/MenPower.vue';
import ShowProject from '../pages/report/ShowProject.vue';

import ReportingPage from '../pages/reporting-system/ReportingPage.vue';
import Login from '../components/authentication/Login.vue';
import AuthPage from '../pages/authentication/Auth.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: AuthPage,
  },
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
        path: '/report/show',
        name: 'report',
        component: ReportPage,
      },
      {
        path: '/report/member',
        name: 'member',
        component: WorkingTime,
      },
      {
        path: '/report/addmember',
        name: 'addmember',
        component: AddMember,
      },
      {
        path: '/report/showProject',
        name: 'showProject',
        component: MemberReport,
      },
      {
        path: '/report/showMenPower',
        name: 'menpower',
        component: MenPower,
      },
      {
        path: '/report/showProjectWithDate',
        name: 'showproject',
        component: ShowProject,
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
