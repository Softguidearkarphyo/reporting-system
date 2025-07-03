export const useMemberStore = defineStore('member', () => {
  const members = ref([]);
  const getMembers = computed(() => members.value);
  const setMembers = (data) => {
    members.value = data;
  };
  const createMember = async (payload) => {
    try {
      const response = await useFetchApi('/blog/get', {
        method: 'POST',
        payload,
      });
      setBlogs(response);
      return response;
    } catch (error) {
      $toast.error(error?.data?.message || error.message);
      return error;
    }
  };

  return {
    blogs,
    getBlogs,
    setBlogs,
    fetchBlogs,
    createBlogs,
    deleteBlogs,
  };
});
