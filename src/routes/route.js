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
import Leave from '../pages/reporting-system/LeaveRecord.vue';
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
    path: '/reporiting-system/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: '/reporiting-system/dashoard',
        component: DashBoard,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/member-lists',
        name: 'member-lists',
        component: MemberList,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/leaves',
        name: 'leaves',
        component: Leave,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/reporting',
        name: 'reporting',
        component: Reporting,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/show',
        name: 'report',
        component: ReportPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/members',
        name: 'members',
        component: WorkingTime,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/show-projects',
        name: 'show-project',
        component: MemberReport,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/show-men-powers',
        name: 'men-power',
        component: MenPower,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/show-project-date',
        name: 'show-project',
        component: ShowProject,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/add-members',
        name: 'add-members',
        component: AddMember,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/add-leaves',
        name: 'add-leaves',
        component: Addleave,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/member-fine',
        name: 'member-fine',
        component: Fine,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/add-projects',
        name: 'add-projects',
        component: AddProject,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporiting-system/profile',
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
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
