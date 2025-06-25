<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    class="custom-input"
    :label="label"
    :type="type"
    :autocomplete="autocomplete"
    :maxlength="maxlength"
    :prepend-inner-icon="prependIcon"
    :append-icon="appendIcon"
    variant="plain"
    dense
    hide-details
  />
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
  prependIcon: String,
  appendIcon: String,
})
</script>

<style scoped>
::v-deep(.custom-input .v-field__field) {
  padding: 0 !important;
  border-bottom: 1px solid #121313;
  background: transparent !important;
  box-shadow: none !important;
}
::v-deep(.custom-input .v-field--focused .v-field__field) {
  border-bottom: 3px solid #03c9d7!important;
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
::v-deep(.custom-input .v-label) {
  color: black !important;
  font-weight: 400;
  font-size: 13px;
}
::v-deep(.custom-input .v-field.v-field--focused .v-label) {
  color: #03c9d7 !important;
}
</style>
