import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/plugins/axios';
import { profileImgPath } from '@/utils/helper';
import { useRouter } from 'vue-router'; 
import { toast } from '@/utils/toast';

export const useAuthStore = defineStore('auth', () => {
  const staff = ref(null);
  const router = useRouter();

  const loginStaff = computed(() => staff.value);
  const isLoggedIn = computed(() => !!staff.value);
  const staffName = computed(() => (staff.value ? staff.value.eng_name : ''));
  const staffRole = computed(() => (staff.value ? String(staff.value.role) : localStorage.getItem('staff-role')));
  const workType = computed(() => staff.value?.work_type || 'onsite'); 

  async function login(username, password) {
    try {
      await api.get('../sanctum/csrf-cookie');
      const res = await api.post('/login', { 
        username, 
        password,
        // latitude: lat,
        // longitude: lon
      });

      staff.value = res.data.staff;
      const profileImg = staff.value?.staff_image_url 
        || (staff.value?.staff_image ? `http://localhost:8080/images/staffs/${staff.value.staff_image}` : null) 
        || profileImgPath(staff.value.eng_name);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('staff-id', String(staff.value.id));
      localStorage.setItem('staff-role', String(staff.value.role));
      sessionStorage.setItem('profileImg', profileImg);

      return staff.value;
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }

async function checkIn(payload = {}) {
  try {
    const staffId = staff.value?.id || localStorage.getItem('staff-id');
    
    const response = await api.post('/reporting-system/attendance/check-in', {
      staff_id: staffId,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
      accuracy: payload.accuracy ?? null,
      is_laptop: payload.is_laptop ?? false,
      device_uuid: payload.device_uuid ?? null,
    });

    // console.log('Check-In Response:', response.data);
    toast.success(response.data?.message || 'Check-in successful.');
    return response.data;
    
  } catch (error) {
    toast.error(error.response?.data?.message || 'Check-in failed. Please try again.');
    console.error('Check-In Error:', error);
    throw error;
  }
}

async function fetchLocationStaffs() {
  try {
    const res = await api.post('/reporting-system/location/staff-location');
    return res.data;
  } catch (error) {
    toast.error('Failed to fetch location staffs.');
    console.error('Fetch Location Staffs Error:', error);
    throw error;
  }
}

async function saveStaffLocation(payload) {
  try {
    const res = await api.post('/reporting-system/location/save-location', payload);
    toast.success('Location Updated Successfully.');
    return res.data;
  } catch (error) {
    toast.error('Failed to save staff location.');
    console.error('Save Staff Location Error:', error);
    throw error;
  }
}

 const deleteLocation = async (payload) => {
    try {
      const response = await api.post('/reporting-system/location/delete', payload);
      toast.success('Location deleted successfully.');
      return response;
    } catch (error) {
      toast.error('Failed to delete location.');
      return error;
    }
  };


  async function fetchStaff() {
    try {
      const token = localStorage.getItem('token');
      const savedStaffId = localStorage.getItem('staff-id');

      if (!token) {
        staff.value = null;
        return null;
      }

      const res = await api.post('/reporting-system/staff/get');

      if (Array.isArray(res.data)) {
        if (savedStaffId) {
          staff.value = res.data.find((s) => String(s.id) === String(savedStaffId)) || null;
        } else {
          staff.value = null;
        }
      } else {
        staff.value = res.data?.data || res.data;
      }

      if (staff.value?.id) {
        localStorage.setItem('staff-id', String(staff.value.id));
      }
      if (staff.value?.role !== undefined) {
        localStorage.setItem('staff-role', String(staff.value.role));
      }

      return staff.value;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        staff.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('staff-role');
        localStorage.removeItem('staff-id');
        sessionStorage.removeItem('profileImg');

        if (router) {
          router.push('/login');
        }
      }
      return null;
    }
  }

  async function logout() {
    staff.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('staff-role');
    localStorage.removeItem('staff-id');
    sessionStorage.removeItem('profileImg');
    if (router) {
      router.push('/login');
    }
  }

  return {
    staff,
    loginStaff,
    isLoggedIn,
    staffName,
    staffRole,
    workType,
    login,
    checkIn,
    fetchStaff,
    fetchLocationStaffs,
    saveStaffLocation,
    deleteLocation,
    logout
  };
});