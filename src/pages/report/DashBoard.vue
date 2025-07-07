<template>
  <div>
    <BaseTitle>{{ $t('sidebar.dashboard') }}</BaseTitle>
    <h1></h1>
    <WidgetCard></WidgetCard>
  </div>
</template>
<script setup>
import BaseTitle from '../../components/bases/BaseTitle.vue';
import BaseMultiselect from '../../components/bases/BaseMultiselect.vue';
import WidgetCard from '../../components/card/WidgetCard.vue';
</script>
