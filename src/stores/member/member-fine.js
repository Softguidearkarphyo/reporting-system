import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useMemberFineStore = defineStore('memberFine', () => {
    const memberFine = ref([]);
    const getMemberFine = computed(() => memberFine.value);
    const setMemberFine = (data)=>{
        memberFine.value = data;
    }

  const createMemberFine = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/fines/create',
        payload
      );
      toast.success('Fine Created Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Create Fine');
      return error;
    }
  };

  const fetchMemberFine = async () => {
    try {
      const response = await api.get('/reporting-system/fines/get');
      setMemberFine(response.data)
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Fines');
      return error;
    }
  };

  const deleteMemberFine = async (payload) => {
    try {
      const response = await api.post('/reporting-system/fines/delete', payload);
      toast.success('Fine Deleted Successfully.');
      return response;
    } catch (error) {
      toast.success('Fail to Delete Member');
      return error;
    }
  }

  const updateMemberFineStatus =  async (payload) => {
    try {
      const response = await api.post('/reporting-system/fines/status-change', payload);
      toast.success('Fine status Change Successfully.');
      return response;
    } catch (error) {
      toast.success('Fail to Change Member Fine');
      return error;
    }
  }

  return {
    memberFine,
    getMemberFine,
    setMemberFine,
    createMemberFine,
    fetchMemberFine,
    deleteMemberFine,
    updateMemberFineStatus
  };
});
