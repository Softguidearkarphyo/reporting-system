<template>
  <div class="text-center pa-4">
    <v-dialog v-bind="$attrs" max-width="350" persistent>
      <v-card class="rounded pa-4">
        <v-card-text>
          <div
            v-for="(txt, index) in dialogText"
            :key="index"
            style="font-size: 13px; text-align: center"
          >
            {{ txt }}
          </div>
        </v-card-text>

        <div style="text-align: center">
          <v-btn
            color="green"
            icon
            @click="$emit('yes')"
            size="large"
            class="mx-4"
            style="
              min-width: 60px;
              height: 30px;
              border-radius: 3px;
              background-color: #4caf50;
            "
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>

          <v-btn
            color="red"
            icon
            @click="$emit('no')"
            size="large"
            class="mx-4"
            style="
              min-width: 60px;
              height: 30px;
              border-radius: 3px;
              background-color: #f44336;
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-alert-circle-outline',
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

const { t } = useI18n();

const dialogText = computed(() => {
  const text = props.text || t('common.deleteConfirmText');
  return text.includes(' # ') ? text.split(' # ') : [text];
});
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
</style>
