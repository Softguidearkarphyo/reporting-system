import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
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
      toast.error('Fail to create leave record');
      return error;
    }
  };

  return {
    getLeaveRecord,
    setLeaveRecord,
    createLeaveRecord,
    fetchLeaveRecord,
  };
});
