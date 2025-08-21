<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="text" class="ma-0 pa-0 me-1">
        <v-app-bar-nav-icon>
          <img
            :src="profileImage"
            alt="Profile"
            v-if="profileImage"
            class="profileImage"
          />
        </v-app-bar-nav-icon>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="150" elevation="10" class="mt-2 color">
      <v-list class="py-0" lines="one" density="compact">
        <v-list-item @click="EditEmployee" value="profile">
          <template v-slot:prepend>
            <v-icon class="profile">mdi-account</v-icon>
          </template>
          <v-list-item-title class="pl-2 text-body-1"
            >My Profile</v-list-item-title
          >
        </v-list-item>
      </v-list>
      <div class="pt-2 pb-2 px-3 text-center">
        <v-btn
          @click="handleLogout"
          size="small"
          color="secondary"
          variant="outlined"
          block
          link
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.js';
import { profileImgPath } from '@/utils/helper';

const router = useRouter();
const authStore = useAuthStore();
const profileImage = ref('');

onMounted(() => {
  const storedImg = sessionStorage.getItem('profileImg');
  if (storedImg) {
    profileImage.value = storedImg;
  } else {
    const username = sessionStorage.getItem('staffname');
    if (username) {
      profileImage.value = profileImgPath(username);
    }
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};
const EditEmployee = () => {
  const staff = authStore.loginStaff;
  const memberId = staff?.id;
  if (memberId) {
    router.push(`/reporting-system/edit-members/${memberId}`);
  }
};
</script>
<style scoped>
.v-theme--dark .color {
  border: 1px solid rgba(173, 173, 173, 0.336) !important;
}
.v-list-item:hover:not(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.2);
  color: rgb(var(--v-theme-primary)) !important;
}
.v-list-item.v-list-item--active {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
}

.v-list-item.v-list-item--active:hover {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: white;
}
.v-list-item-title {
  font-size: 14px !important;
}

::v-deep(.v-list-item__spacer) {
  display: none !important;
}
</style>
