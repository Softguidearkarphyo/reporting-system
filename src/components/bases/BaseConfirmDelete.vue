<template>
  <div class="text-center pa-4">
    <v-dialog v-bind="$attrs" max-width="400" persistent>
      <v-card>
        <v-card-title class="bg-error d-flex align-center"
          ><v-icon class="mr-2 icon">{{ icon }}</v-icon
          >{{ dialogTitle }}</v-card-title
        >
        <v-card-text>
          <div v-for="(txt, index) in dialogText" :key="index">{{ txt }}</div>
        </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="$emit('no')"> {{ t('common.deleteBtnCancelText') }} </v-btn>

          <v-btn @click="$emit('yes')" class="text-error">
            {{ mainBtnText }}
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  icon: {
    type: String,
    default: "mdi-alert-circle-outline",
  },
  text: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  mainBtn: {
    type: String,
    required: false,
  },
});

const { t } = useI18n()

const dialogTitle = computed(() => {
  return props.title || t('common.deleteConfirmTitle')
})
const dialogText = computed(() => {
  const text = props.text || t('common.deleteConfirmText')
  return text.includes(' # ') ? text.split(' # ') : [text]
})
const mainBtnText = computed(() => {
  return props.mainBtn || t('common.deleteBtnText')
})
</script>

<style>
@keyframes alertPulse {
    0% {
        transform: scale(1) rotate(0deg);
    }
    30% {
        transform: scale(1.2) rotate(0deg);
    }
    40% {
        transform: scale(1.2) rotate(15deg);
    }
    50% {
        transform: scale(1.2) rotate(-15deg);
    }
    60% {
        transform: scale(1.2) rotate(0deg);
    }
    100% {
        transform: scale(1) rotate(0deg);
    }
}

.icon {
  display: inline-block;
  animation: alertPulse 1.5s ease-in-out infinite;
}
.v-dialog__actions .v-btn {
  text-transform: none !important;
}
</style>

