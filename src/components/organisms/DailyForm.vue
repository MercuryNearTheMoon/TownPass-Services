<template>
  <div class="h-screen bg-primary-50">
    <BaseLoader v-if="isLoading" />
    <BaseCard v-else>
      <div v-for="([key, item], index) in Object.entries(store.form)" :key="key">
        <div
          class="py-3"
          v-if="
            item.label !== store.form.week.label ||
            (item.label === store.form.week.label && !item.disabled)
          "
        >
          <span v-if="item.required" style="color: red; font-weight: bold">*</span>
          <span style="font-weight: bold">{{ item.label }}</span>
          <DatePicker
            v-model="item.data"
            :required="item.required"
            v-if="item.label === store.form.date.label"
          />
          <BaseInput
            v-model="item.data"
            :required="item.required"
            :placeholder="item.data !== '' ? item.data : 'Input Text'"
            v-else
          />
        </div>
      </div>
    </BaseCard>
    <div class="flex gap-3 mx-4 my-8">
      <BaseButton class="flex-grow" outline @click="submitForm">取消</BaseButton>
      
        <BaseButton
          class="flex-grow"
          @click="
            insertDailyDocument(
              'pregnancy-health',
              new Date(store.form.date.data),
              store.form.week.data,
              store.form.weight.data,
              store.form.blood.data
            )
          "
        ><RouterLink to="/health-stats">
          儲存
      </RouterLink> 
        </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/atoms/BaseCard.vue';
import DatePicker from '../molecules/DatePicker.vue';
import BaseInput from '@/components/atoms/BaseInput.vue';
import { onMounted, reactive } from 'vue';
import BaseButton from '../atoms/BaseButton.vue';
import { insertDocument, getAllDocuments } from '@/api/pregnancy';
import BaseLoader from '@/components/atoms/BaseLoader.vue';
import { ref } from 'vue';

const isLoading = ref(true);

onMounted(async () => {
  try {
    const data = await getAllDocuments('pregnancy-health');
    console.log('Fetched data:', data);

    if (Array.isArray(data) && data.length > 0) {
      const today = new Date();
      const fetchedDate = new Date(data[0].date.seconds * 1000);
      const dayDifference = today.getDay() - fetchedDate.getDay();
      console.log('Day difference:', dayDifference);
      console.log('Today:', today);
      console.log('Fetched date:', fetchedDate);
      store.form.week.data = data[0].week + dayDifference;
      store.form.week.disabled = true;
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
  isLoading.value = false;
});

const store = reactive({
  form: {
    date: {
      label: '日期',
      data: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      required: true
    },
    week: {
      label: '週次',
      data: '',
      required: true,
      disabled: false
    },
    weight: {
      label: '體重',
      data: '',
      required: true
    },
    blood: {
      label: '血壓',
      data: '',
      required: true
    }
  }
});
</script>

<style lang="postcss">
div {
  margin-bottom: 10px;
}

span {
  margin-right: 5px;
}

input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
