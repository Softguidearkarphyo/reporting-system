import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useAttendanceStore = defineStore('attendance', () => {
  const attendances = ref([]);

  const getAttendances = computed(() => attendances.value);

  const fetchAttendances = async (params = {}) => {
    try {
      const response = await api.post('/reporting-system/attendance/list', { params });
      attendances.value = response.data?.data || response.data || [];
      return response;
    } catch (error) {
      toast.error('Failed to fetch attendance records');
      return error;
    }
  };

  const deleteAttendance = async (payload) => {
    try {
      const response = await api.post('/reporting-system/attendance/delete', payload);
      toast.success('Attendance record deleted successfully.');
      return response;
    } catch (error) {
      toast.error('Failed to delete attendance record.');
      return error;
    }
  };

  return {
    attendances,
    getAttendances,
    fetchAttendances,
    deleteAttendance,
  };
});