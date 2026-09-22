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
      // toast.error('Fail to create leave');
      // return error;
      if (error.response && error.response.status === 422) {
      console.error('Laravel Validation Errors:', error.response.data.errors);
      toast.error('Validation failed: ' + JSON.stringify(error.response.data.errors));
    } else {
      toast.error('Fail to create leave');
    }
    throw error;
    }
  };

  return {
    leaves,
    getLeaves,
    setLeaves,
    fetchLeave,
    createLeave,
  };
});