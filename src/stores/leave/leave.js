import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useLeaveStore = defineStore('leave', () => {
  const leaves = ref([]);
  const getLeaves = computed(() => leaves.value);
  const setLeaves = (data) => {
    leaves.value = data;
  };
  const fetchLeave = async (payload) => {
    try {
      const response = await api.post('/reporting-system/leave/get', payload);
      setLeaves(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Leaves');
      return error;
    }
  };
  const createLeave = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/leave/create',
        payload
      );
      toast.success('Leave Created Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to create leave');
      return error;
    }
  };

  return {
    getLeaves,
    setLeaves,
    fetchLeave,
    createLeave,
  };
});
