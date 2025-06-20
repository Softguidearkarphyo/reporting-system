<template>
  <v-app>
    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>報告</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="mb-4">
              <v-card-title class="primary">作業実績管理</v-card-title>
              <v-divider class="mb-4" />
              <v-card-actions>
                <v-btn to="/report/dashboard" color="primary">GO</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card>
              <v-card-title class="primary">報告システム</v-card-title>
              <v-divider class="mb-4" />
              <v-card-actions>
                <v-btn to="/reporting" color="primary">GO</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup></script>
