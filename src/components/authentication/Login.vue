<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center"
      style="height: 100vh; background: #f5e7d5"
    >
      <v-card
        class="pa-6"
        elevation="10"
        rounded="lg"
        width="100%"
        max-width="420"
        style="box-shadow: 0 10px 30px rgba(33, 150, 243, 0.2)"
      >
        <div class="d-flex justify-center mb-5">
          <v-avatar size="64" color="transparent">
            <v-icon size="36" class="gradient-icon">mdi-lock</v-icon>
          </v-avatar>
        </div>

        <v-form>
          <div class="d-flex align-center mb-5">
            <v-icon class="mr-3" color="#70e000" size="22">mdi-account</v-icon>
            <v-text-field
              label="Username"
              type="text"
              variant="underlined"
              dense
              autocomplete="username"
              hide-details
              class="flex-grow-1 custom-input"
            />
          </div>

          <div class="d-flex align-center mb-6">
            <v-icon class="mr-3" color="#70e000" size="22">mdi-lock</v-icon>
            <v-text-field
              label="Password"
              type="password"
              variant="underlined"
              dense
              autocomplete="current-password"
              hide-details
              class="flex-grow-1 custom-input"
            />
          </div>

          <v-card-actions class="justify-center pa-0">
            <v-btn
              elevation="4"
              rounded="lg"
              class="gradient-btn"
              style="width: 100%; font-weight: 600; letter-spacing: 1.2px"
              @click="login"
              height="48"
              depressed
              to="/report/dashboard"
            >
              LOGIN
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-main>
  </v-app>
</template>

<script setup>
function login() {
  alert('Login clicked!');
}
</script>

<style scoped>
.gradient-icon {
  background: linear-gradient(90deg, #70e000 0%, #ccff33 50%, #70e000 100%);

  /* background: linear-gradient(45deg, #2196f3, #21cbf3); */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 1px rgba(33, 150, 243, 0.5));
}

.gradient-btn {
  background: linear-gradient(-90deg, #70e000, #ccff33) !important;
  /* background: linear-gradient(90deg, #2196f3, #21cbf3); */
  color: #748cab !important;

  transition: background 0.3s ease;
}

.gradient-btn:hover {
  background: linear-gradient(90deg, #1976d2, #1e88e5);
}

/* Input fields with bottom-only border */
.custom-input .v-input__control {
  border: none !important;
  border-bottom: 2px solid #bbb !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  box-shadow: none !important;
  transition: border-color 0.3s ease;
}

.custom-input.v-input--is-focused .v-input__control {
  border-bottom-color: #1976d2 !important;
  box-shadow: none !important;
  background-color: transparent !important;
}

.custom-input .v-label {
  color: #1976d2 !important;
  font-weight: 600;
}

.custom-input input::placeholder {
  color: #999;
  opacity: 1;
}
</style>
