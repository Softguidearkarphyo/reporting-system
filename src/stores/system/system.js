import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';

export const useSystemStore = defineStore('system', () => {
  const techStacks = ref([]);
  const getTechStacks = computed(() => techStacks.value);
  const setTechStacks = (data) => {
    techStacks.value = data;
  };

  const responsibilities = ref([]);
  const getResponsibilities = computed(() => responsibilities.value);
  const setResponsibilities = (data) => {
    responsibilities.value = data;
  };

  const proficiencyLevels = ref([]);
  const getProficiencyLevels = computed(() => proficiencyLevels.value);
  const setProficiencyLevels = (data) => {
    proficiencyLevels.value = data;
  };

  const position = ref([]);
  const getPosition = computed(() => position.value);
  const setPosition = (data) => {
    position.value = data;
  };

  const grade = ref([]);
  const getGrade = computed(() => grade.value);
  const setGrade = (data) => {
    grade.value = data;
  };

  const japaneseLevel = ref([]);
  const getJapaneseLevel = computed(() => japaneseLevel.value);
  const setJapaneseLevel = (data) => {
    japaneseLevel.value = data;
  };

  const fetchTechStacks = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-tech-stack'
      );
      setTechStacks(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch TechStacks');
      return error;
    }
  };

  const fetchResponsibilities = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-responsibility'
      );
      setResponsibilities(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Responsibilities');
      return error;
    }
  };
  const fetchProficiencyLevels = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-proficiency-level'
      );
      setProficiencyLevels(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Responsibilities');
      return error;
    }
  };
  const fetchGrade = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-grade'
      );
      setGrade(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Grade');
      return error;
    }
  };
  const fetchPosition = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-position'
      );
      setPosition(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch Position');
      return error;
    }
  };
  const fetchJapaneseLevel = async () => {
    try {
      const response = await api.post(
        '/reporting-system/sys-management/get-japanese-level'
      );
      setJapaneseLevel(response.data);
      return response;
    } catch (error) {
      toast.error('Fail to Fetch JapaneseLevel');
      return error;
    }
  };

  return {
    techStacks,
    getTechStacks,
    setTechStacks,
    fetchTechStacks,

    responsibilities,
    getResponsibilities,
    setResponsibilities,
    fetchResponsibilities,

    proficiencyLevels,
    getProficiencyLevels,
    setProficiencyLevels,
    fetchProficiencyLevels,

    grade,
    getGrade,
    setGrade,
    fetchGrade,

    position,
    getPosition,
    setPosition,
    fetchPosition,

    japaneseLevel,
    getJapaneseLevel,
    setJapaneseLevel,
    fetchJapaneseLevel,
  };
});
