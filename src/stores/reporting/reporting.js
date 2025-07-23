import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useReportingStore = defineStore('reporting', () => {
  const projects = ref([]);
  const getProjects = computed(() => projects.value);
  const setProjects = (data) => {
    projects.value = data;
  };

  const fetchProject = async (payload) => {
    try {
      const response = await api.post('/reporting-system/project/get', payload);
      setProjects(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Projects');
      return error;
    }
  };

  const members = ref([]);
  const getMembers = computed(() => members.value);
  const setMembers = (data) => {
    members.value = data;
  };
  const fetchMember = async (payload) => {
    try {
      const response = await api.post('/reporting-system/staff/get', payload);
      setMembers(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Members');
      return error;
    }
  };

  const tasks = ref([]);
  const getTasks = computed(() => tasks.value);
  const setTasks = (data) => {
    tasks.value = data;
  };
  const fetchTask = async (payload) => {
    try {
      const response = await api.post('/reporting-system/task/get', payload);
      setTasks(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Tasks');
      return error;
    }
  };

  const createTaskPerformance = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/task-performance/create',
        payload
      );
      toast.success('Working Hour Filled Successfully');
      return response;
    } catch (error) {
      const errorMsg = Object.values(error.response?.data?.errors)?.[0][0];
      toast.error(errorMsg);
      return error;
    }
  };

  const deleteTaskPerformance = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/task-performance/delete',
        payload
      );
      toast.success('Working Hour Cleared Successfully');
      return response;
    } catch (error) {
      const errorMsg = Object.values(error.response?.data?.errors)?.[0][0];
      toast.error(errorMsg);
      return error;
    }
  };

  return {
    projects,
    getProjects,
    setProjects,
    fetchProject,
    members,
    getMembers,
    setMembers,
    fetchMember,
    tasks,
    getTasks,
    setTasks,
    fetchTask,
    createTaskPerformance,
    deleteTaskPerformance,
  };
});
