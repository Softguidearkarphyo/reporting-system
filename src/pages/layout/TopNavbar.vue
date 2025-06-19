<template>
  <v-card height="100">
    <v-toolbar extended>
      <v-toolbar-title text="Dashboard"></v-toolbar-title>

      <template v-slot:append>
        <v-btn icon="mdi-magnify">S</v-btn>

        <v-btn icon="mdi-dots-vertical">S</v-btn>

        <v-btn to="/" color="primary">B</v-btn>
      </template>
    </v-toolbar>
  </v-card>
</template>
