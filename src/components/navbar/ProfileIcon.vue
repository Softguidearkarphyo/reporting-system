<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon variant="text" class="ma-0 pa-0">
        <v-app-bar-nav-icon>
          <v-icon size="32">mdi-account-circle-outline</v-icon>
        </v-app-bar-nav-icon>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
      <v-list class="py-0" lines="one" density="compact">
        <v-list-item value="profile">
          <template v-slot:prepend> </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Profile</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="account">
          <template v-slot:prepend> </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Account</v-list-item-title
          >
        </v-list-item>
        <v-list-item value="task">
          <template v-slot:prepend> </template>
          <v-list-item-title class="pl-4 text-body-1"
            >My Task</v-list-item-title
          >
        </v-list-item>
      </v-list>
      <div class="pt-4 pb-4 px-5 text-center">
        <v-btn to="/" class="logout" variant="outlined" block link
          >Logout</v-btn
        >
      </div>
    </v-sheet>
  </v-menu>
</template>
<style scoped>
.logout {
  color: red;
}
::v-deep(.v-list-item:hover) {
  background-color: rgba(3, 201, 215, 0.2);
  color: #03c9d7 !important;
}
</style>
