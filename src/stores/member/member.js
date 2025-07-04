import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useMemberStore = defineStore('member', () => {
  // const toast = useToast();
  const members = ref([]);
  const getMembers = computed(() => members.value);
  const setMembers = (data) => {
    members.value = data;
  };
  const createMember = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/staff/create',
        payload
      );
      setMembers(response);
      toast.success('Member Created Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Create Member');
      return error;
    }
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
    createMember,
    fetchMember,
    deleteMember,
  };
});
