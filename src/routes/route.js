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
import MemberList from '../pages/reporting-system/MemberList.vue';
import Leave from '../pages/reporting-system/MemberLeave.vue';
import Reporting from '../pages/reporting-system/ReportingPage.vue';
import Addleave from '../pages/report/AddLeave.vue';
import Fine from '../pages/report/MemberFine.vue';
import AddProject from '../pages/report/AddProject.vue';
import Login from '../components/authentication/Login.vue';
import Profile from '../pages/authentication/Profile.vue';
import AuthPage from '../pages/authentication/Auth.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: AuthPage,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashoard',
        component: DashBoard,
      },
      {
        path: 'member-list',
        name: 'memberlist',
        component: MemberList,
        meta: { requiresAuth: true },
      },
      {
        path: 'leave',
        name: 'leave',
        component: Leave,
        meta: { requiresAuth: true },
      },
      {
        path: 'reporting',
        name: 'reporting',
        component: Reporting,
        meta: { requiresAuth: true },
      },
      {
        path: 'show',
        name: 'report',
        component: ReportPage,
        meta: { requiresAuth: true },
      },
      {
        path: 'member',
        name: 'member',
        component: WorkingTime,
        meta: { requiresAuth: true },
      },
      {
        path: 'showProject',
        name: 'showProject',
        component: MemberReport,
        meta: { requiresAuth: true },
      },
      {
        path: 'showMenPower',
        name: 'menpower',
        component: MenPower,
        meta: { requiresAuth: true },
      },
      {
        path: 'showProjectWithDate',
        name: 'showproject',
        component: ShowProject,
        meta: { requiresAuth: true },
      },
      {
        path: 'addmember',
        name: 'addmember',
        component: AddMember,
        meta: { requiresAuth: true },
      },
      {
        path: 'addleave',
        name: 'addleave',
        component: Addleave,
        meta: { requiresAuth: true },
      },
      {
        path: 'memberfine',
        name: 'memberfine',
        component: Fine,
        meta: { requiresAuth: true },
      },
      {
        path: 'addproject',
        name: 'addproject',
        component: AddProject,
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ login guard
router.beforeEach((to, from, next) => {
  alert('Login guard triggered');
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
