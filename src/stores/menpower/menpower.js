import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useMenPowerStoreStore = defineStore('menpower', () => {
  const menPower = ref([]);
  const getMenPower = computed(() => menPower.value);
  const setMenPower = (data) => {
    menPower.value = data;
  };

  const fetchMenPower = async (payload) => {
    try {
      const response = await api.post(
        '/reporting-system/men-power/get',
        payload
      );
      setMenPower(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Men Power');
      return error;
    }
  };

  return {
    menPower,
    getMenPower,
    setMenPower,
    fetchMenPower,
  };
});
