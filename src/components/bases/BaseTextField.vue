<template>
  <div class="d-flex align-center mb-5">
    <v-icon class="mr-3 mt-5" size="22" :color="prependIconColor">{{
      prependIcon
    }}</v-icon>

    <v-text-field
      v-bind="$attrs"
      class="custom-input"
      :label="label"
      :type="type"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      variant="plain"
      dense
      hide-details
    >
    </v-text-field>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  autocomplete: String,
  maxlength: [Number, String],
  prependIcon: [String, Object],
  prependIconColor: {
    type: String,
    default: '#03c9d7',
  },
});
</script>

<style scoped>
::v-deep(.custom-input .v-field__field) {
  padding: 0 !important;
  border-bottom: 1px solid #121313;
  background: transparent !important;
  box-shadow: none !important;
}
::v-deep(.custom-input .v-field--focused .v-field__field) {
  border-bottom: 2px solid #03c9d7 !important;
}
::v-deep(.custom-input .v-field__outline),
::v-deep(.custom-input .v-field__overlay),
::v-deep(.custom-input .v-field__field::before),
::v-deep(.custom-input .v-field__field::after) {
  border: none !important;
  box-shadow: none !important;
  background: none !important;
  content: none !important;
}
::v-deep(.v-label) {
  text-transform: uppercase !important;
}
::v-deep(.custom-input .v-field.v-field--focused .v-label) {
  color: #03c9d7 !important;
}
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
