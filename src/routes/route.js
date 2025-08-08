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
import ReportingSetting from '../pages/report/ReportingSetting.vue';
import Addleave from '../pages/report/AddLeave.vue';
import Fine from '../pages/report/MemberFine.vue';
import AddProject from '../pages/report/AddProject.vue';
import NotFound from '../pages/report/404.vue';
import StaffCard from '../pages/report/StaffCard.vue';
import MemberSkill from '../pages/report/MemeberSkill.vue';
import AddSkill from '../pages/report/AddSkill.vue';
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
    path: '/reporting-system/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: '/reporting-system/dashoard',
        component: DashBoard,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/employee-lists',
        name: 'member-lists',
        component: MemberList,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/employee-competency',
        name: 'member-skill',
        component: MemberSkill,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/leave-records',
        name: 'leaves',
        component: Leave,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/reporting',
        name: 'reporting',
        component: Reporting,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/reporting-setting',
        name: 'reporting-setting',
        component: ReportingSetting,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/show',
        name: 'report',
        component: ReportPage,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/weekly-work-time',
        name: 'members',
        component: WorkingTime,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/employee-reports',
        name: 'show-projects',
        component: MemberReport,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/show-men-powers',
        name: 'men-power',
        component: MenPower,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/show-project-date',
        name: 'show-project-date',
        component: ShowProject,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-employee',
        name: 'add-members',
        component: AddMember,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/edit-members/:memberId',
        name: 'edit-members',
        component: AddMember,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-employee-leave',
        name: 'add-leaves',
        component: Addleave,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-fine-record',
        name: 'member-fine',
        component: Fine,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-projects',
        name: 'add-projects',
        component: AddProject,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-employee-card',
        name: 'staff-card',
        component: StaffCard,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/new-employee-skills',
        name: 'add-skill',
        component: AddSkill,
        meta: { requiresAuth: true },
      },
      {
        path: '/reporting-system/edit-employee-skill/:skillSheetId',
        name: 'edit-employee-skill',
        component: AddSkill,
        meta: { requiresAuth: true },
      },
      // {
      //   path: '/reporting-system/profile',
      //   name: 'profile',
      //   component: Profile,
      //   meta: { requiresAuth: true },
      // },
      {
        path: '/reporting-system/show-project-search',
        name: 'show-project-date',
        component: ShowProject,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ login guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token');
  if (to.path === '/login' && !isLoggedIn) {
    next('/');
  } else if ((to.path === '/' || to.path === '/login') && isLoggedIn) {
    next('/reporting-system/dashboard');
  } else if (to.meta.requiresAuth && !isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
