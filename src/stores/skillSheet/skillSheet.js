import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
export const useSkillSheetStore = defineStore('skillSheet', () => {
  const skillSheets = ref([]);
  const getSkillSheets = computed(() => skillSheets.value);
  const setSkillSheets = (data) => {
    skillSheets.value = data;
  };
  const fetchSkillSheet = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/employee-skill-sheet/get',
        payload
      );
      setSkillSheets(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Skillsheets');
      return error;
    }
  };

  const createSkillSheet = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/employee-skill-sheet/create',
        payload
      );
      toast.success('Skillsheet Created Successfully.');
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
      toast.success('Skillsheet Updated Successfully.');
      return response;
    } catch (error) {
      toast.error('Fail to Update Skillsheet.');
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
    skillSheets,
    getSkillSheets,
    setSkillSheets,
    fetchSkillSheet,
    createSkillSheet,
    updateMember,
    deleteMember,
  };
});
