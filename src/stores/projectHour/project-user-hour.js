import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useShowProject = defineStore('projecthour', () => {

    const projecthour = ref([]);
    const getProjecthour = computed(() => projecthour.value);
    const setProjecthour = (data)=>{
        projecthour.value = data;
    }
    const fetchProjecthour = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/project-hour/get',
        payload
      );
      setProjecthour(response.data)
      toast.success('Project Hour Fetch Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Project Hour');
      return error;
    }
  };

  return {
    projecthour,
    getProjecthour,
    setProjecthour,
    fetchProjecthour,
  };
});
