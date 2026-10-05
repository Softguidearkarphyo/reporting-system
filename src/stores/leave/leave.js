import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as yup from 'yup';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const leaveSchema = (t, multipleLeave) => {
  return yup.object({
    leave_date: multipleLeave
      ? yup.string().nullable()
      : yup.string().required(
          t('validation.required', { field: t('creatLeave.form.leave_date') })
        ),

    multi_date: multipleLeave
      ? yup
          .array()
          .of(yup.string())
          .min(
            1,
            t('validation.required', { field: t('creatLeave.form.leave_date') })
          )
          .required(
            t('validation.required', { field: t('creatLeave.form.leave_date') })
          )
      : yup.array().nullable(),

    duration: multipleLeave
      ? yup.string().nullable()
      : yup.string().required(
          t('validation.required', { field: t('creatLeave.form.duration') })
        ),

    reason: yup.string().required(
      t('validation.required', { field: t('creatLeave.form.reason') })
    ),
  });
};

export const otSchema = (t) => {
  return yup.object({
    ot_date: yup.string().required(
      t('validation.required', { field: t('creatLeave.form.ot_date') })
    ),
    ot_time: yup.string().required(
      t('validation.required', { field: t('creatLeave.form.ot_time') })
    ),
  });
};

export const useLeaveStore = defineStore('leave', () => {
  const leaves = ref([]);
  const leaveRecords = ref([]);

  // Getters
  const getLeaves = computed(() => leaves.value);
  const getLeaveRecords = computed(() => leaveRecords.value);

  // Setters
  const setLeaves = (data) => {
    leaves.value = data;
  };
  const setLeaveRecords = (data) => {
    leaveRecords.value = data;
  };

  // Fetch Leaves API Call
  const fetchLeave = async (payload = {}) => {
    console.log("thsi is ", payload)
    try {
      const response = await api.post('/reporting-system/leave/get', payload);
      setLeaves(response.data);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Fail to Fetch Leaves';
      toast.error(errorMsg);
      throw error;
    }
  };

  // Fetch Leave Records API Call
  const fetchLeaveRecord = async (payload = {}) => {
    console.log("user ", JSON.stringify(payload))
    try {
      const response = await api.post('/reporting-system/leave-record/get', payload);
      setLeaveRecords(response.data);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Fail to Fetch Leave Records';
      toast.error(errorMsg);
      throw error;
    }
  };

  const createLeave = async (payload) => {
    try {
      const shortLeaveDurationIds = [3, 4, 5, 6, 7, 8, 9];
      const isShortLeave = shortLeaveDurationIds.includes(Number(payload.duration));

      let response;

      console.log('in this :');  
      if (isShortLeave) {
        console.log('Short Leave is:', payload); 
        response = await api.post(
          '/reporting-system/leave-record/add-short-leave',
          payload
        );
        toast.success('Short Leave Created Successfully.');
      } else {
        console.log('else:'); 
        response = await api.post(
          '/reporting-system/leave/create',
          payload
        );
        toast.success('Leave Created Successfully.');
      }

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Fail to process leave.';
      toast.error(errorMsg);
      throw error;
    }
  };

  return {
    leaves,
    leaveRecords,
    getLeaves,
    getLeaveRecords,
    setLeaves,
    setLeaveRecords,
    fetchLeave,
    fetchLeaveRecord,
    createLeave,
  };
});