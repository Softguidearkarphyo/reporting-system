import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useOverTimeStore = defineStore('overTime', () => {
  const overTime = ref([]);
  const getOverTime = computed(() => overTime.value);
  const setOverTime = (data) => {
    overTime.value = data;
  };

  const fetchOverTime = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/over-time/get',
        payload
      );
      setOverTime(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Over Time');
      return error;
    }
  };
  const createOverTime = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/over-time/create',
        payload
      );
      toast.success('OverTime Created Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to create OverTime');
      return error;
    }
  };

  return {
    getOverTime,
    setOverTime,
    fetchOverTime,
    createOverTime,
  };
});
