import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useLocationStore = defineStore('location', () => {
  const staffs = ref([]);
  const getStaffs = computed(() => staffs.value);
  const setStaffs = (data) => {
    staffs.value = data;
  };

  const fetchStaffs = async (payload) => {
    try {
      const response = await api.post('/reporting-system/staff/get', payload);
      setStaffs(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Staffs');
      return error;
    }
  };

  return {
    staffs,
    getStaffs,
    setStaffs,
    fetchStaffs,
  };
});
