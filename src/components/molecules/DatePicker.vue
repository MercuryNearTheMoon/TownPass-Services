<script setup lang="ts">
import { ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import BaseInput from '@/components/atoms/BaseInput.vue';

const props = defineProps<{
  required?: boolean;
  triggerValidate?: boolean;
}>();

const date = ref<Date | null>(null);

const isValidate = ref(true);

const validate = () => {
  isValidate.value = !!date.value;
};

watch(
  () => props.triggerValidate,
  () => {
    validate();
  }
);

watch(
  () => date.value,
  () => {
    isValidate.value = true;
  }
);
const masks = ref({
  input: 'YYYY-MM-DD'
});
</script>

<template>
  <DatePicker v-model="date" :masks="masks">
    <template #default="{ togglePopover, inputValue }">
      <BaseInput
        :value="inputValue"
        readonly
        isDatepicker
        @click="togglePopover"
        :class="{ 'base-input--warn': props.required && !isValidate }"
      />
    </template>
  </DatePicker>
</template>

<style>
.base-input--warn {
  border-color: red;
}
</style>
