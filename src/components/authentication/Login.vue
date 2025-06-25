<template>
  <v-app>
    <v-main
      class="d-flex justify-center align-center"
      style="height: 100vh; background: #e3f2fd"
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
           <v-icon class="mr-3 mt-5" color="#03c9d7" size="22">mdi-account</v-icon>
            <v-text-field
              label="USERNAME"
              type="text"
              variant="plain"
              dense
              autocomplete="username"
              hide-details
              class="flex-grow-1 custom-input"
            />
          </div>

          <div class="d-flex align-center mb-6">
             <v-icon class="mr-3 mt-5" color="#03c9d7" size="22">mdi-lock</v-icon>
            <v-text-field
              label="PASSWORD"
              type="password"
              variant="plain"
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
   background: linear-gradient(90deg, #02e2f1, #5de6f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 1px 1px #02e2f1(33, 150, 243, 0.5));
}

.gradient-btn {
  background:#5de6f0 !important;
  color: #f8f8f8 !important;
  /* transition: background 0.3s ease; */
}
.gradient-btn:hover {
  background: linear-gradient(90deg, #1976d2, #1e88e5);
}

/* Input fields with bottom-only border */
::v-deep(.custom-input .v-field__field) {
  padding: 0 !important;             /* built-in padding ဖျောက် */
  border-bottom: 1px solid #121313;  /* အခြေခံ border */
  background: transparent !important;
  box-shadow: none !important;
}

/* Focus ထိုးတဲ့အခါ underline ထူအောင် */
::v-deep(.custom-input .v-field--focused .v-field__field) {
  border-bottom: 3px solid #03c9d7!important;
}

/* Vuetify ထည့်ထားသမျှအလွန် မလိုတဲ့ decoration တွေဖျောက် */
::v-deep(.custom-input .v-field__outline),
::v-deep(.custom-input .v-field__overlay),
::v-deep(.custom-input .v-field__field::before),
::v-deep(.custom-input .v-field__field::after) {
  border: none !important;
  box-shadow: none !important;
  background: none !important;
  content: none !important;
}
/* Label color changes */
::v-deep(.custom-input .v-label) {
  color: black !important;
  font-weight: 400;
  font-size: 13px;
  transition: color 0.3s ease;
}
::v-deep(.custom-input .v-field.v-field--focused .v-label) {
  color: #03c9d7 !important;
}

</style>