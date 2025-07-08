import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useProjectStore = defineStore('project', () => {
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

  const createProject = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/project/create',
        payload
      );
      toast.success('Project Created Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Create Project');
      return error;
    }
  };

  const updateProject = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/project/update',
        payload
      );
      toast.success('Project Updated Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Update Project');
      return error;
    }
  };

  const deleteProject = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/project/delete',
        payload
      );
      toast.success('Project Deleted Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Delete Project');
      return error;
    }
  };

  return {
    projects,
    getProjects,
    setProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  };
});
