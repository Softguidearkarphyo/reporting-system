import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
import { responsibility } from '@/utils/data';
export const useLeaveRecordStore = defineStore('leaveRecord', () => {
  const leaveRecord = ref([]);
  const getLeaveRecord = computed(() => leaveRecord.value);
  const setLeaveRecord = (data) => {
    leaveRecord.value = data;
  };

  const fetchLeaveRecord = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/leave-record/get',
        payload
      );
      setLeaveRecord(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch leave record');
      return error;
    }
  };

const createLeaveRecord = async (payload) => {
  try {
    const response = await api.post(
      '/reporting-system/leave-record/create',
      payload
    );
    toast.success('Leave Record Created Successfully.');
    return response;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors?.staff_id?.[0] || 
      error.response?.data?.error ||                 
      error.response?.data?.message;                 
    if (errorMessage) {
      toast.error(errorMessage);
    }
    throw error;
  }
};

  return {
    getLeaveRecord,
    setLeaveRecord,
    createLeaveRecord,
    fetchLeaveRecord,
  };
});
