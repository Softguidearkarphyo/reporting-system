<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="text" class="ma-0 pa-0 me-1">
        <v-app-bar-nav-icon size="40">
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
        <v-list-item to="/reporting-system/profile" value="profile">
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
<script>
import { useAuthStore } from '@/stores/auth/auth.js';
import { mapActions } from 'pinia';
import { profileImgPath } from '@/utils/helper';

export default {
  data() {
    return {
      profileImage: '',
    };
  },
  mounted() {
    const storedImg = sessionStorage.getItem('profileImg');
    if (storedImg) {
      this.profileImage = storedImg;
    } else {
      const username = sessionStorage.getItem('username');
      if (username) {
        this.profileImage = profileImgPath(username);
      }
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/');
    },
  },
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
.profileImage {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
::v-deep(.v-list-item__spacer) {
  display: none !important;
}
</style>
