import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useMemberStore = defineStore('member', () => {
  const members = ref([]);
  const getMembers = computed(() => members.value);
  const setMembers = (data) => {
    members.value = data;
  };
  const fetchMember = async (payload) => {
    try {
      const response = await api.post('/reporting-system/staff/get', payload);
      setMembers(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Members');
      return error;
    }
  };

  const createMember = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/staff/create',
        payload
      );
      toast.success('Member Created Successfully.');
      return response;
    } catch (error) {
      const errorMsg = Object.values(error.response?.data?.errors)?.[0][0];
      toast.error(errorMsg);
      return error;
    }
  };

  const updateMember = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/staff/update',
        payload
      );
      toast.success('Member Updated Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Update Member.');
      return error;
    }
  };

  const deleteMember = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/staff/delete',
        payload
      );
      toast.success('Member Deleted Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Delete Member');
      return error;
    }
  };

  return {
    members,
    getMembers,
    setMembers,
    fetchMember,
    createMember,
    updateMember,
    deleteMember,
  };
});
