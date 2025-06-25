<template>
  <div>
    <BaseTitle>作業実績管理の会員登録</BaseTitle>
    <v-container>
      <label>test</label>
      <BaseField />
      <BaseButton color="main">submit</BaseButton>
    </v-container>
    <BaseTitle>ユーザＩテーブル</BaseTitle>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">No</th>
          <th class="text-left">ID</th>
          <th class="text-left">Name</th>
          <th class="text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.name">
          <td>{{ item.no }}</td>
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.calories }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import BaseButton from '../../components/bases/BaseButton.vue';
import BaseTitle from '../../components/bases/BaseTitle.vue';
import BaseField from '../../components/bases/BaseField.vue';

const desserts = ref([
  {
    no: 1,
    id: 1005,
    name: 'Frozen Yogurt',
    calories: 159,
  },
  {
    no: 2,
    id: 1003,
    name: 'Ice cream sandwich',
    calories: 237,
  },
  {
    no: 3,
    id: 1006,
    name: 'Eclair',
    calories: 262,
  },
]);
</script>
