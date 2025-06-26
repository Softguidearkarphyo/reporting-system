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
    path: '/report/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'dashoard',
        component: DashBoard,
      },
      {
        path: '/report/memberlist',
        name: 'memberlist',
        component: MemberList,
      },
      {
        path: '/report/leave',
        name: 'leave',
        component: Leave,
      },
      {
        path: '/report/reporting',
        name: 'reporting',
        component: Reporting,
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
      {
        path: '/report/addmember',
        name: 'addmember',
        component: AddMember,
      },
      {
        path: '/report/addleave',
        name: 'addleave',
        component: Addleave,
      },
      {
        path: '/report/memberfine',
        name: 'memberfine',
        component: Fine,
      },
      {
        path: '/report/addproject',
        name: 'addproject',
        component: AddProject,
      },
      {
        path: '/profile',
        name: 'profile',
        component: Profile,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
