<template>
    <div class=" h-screen">
        <BaseCard>
            <div v-for="([key, item], index) in Object.entries(store.form)" :key="key">
                <div class="py-3">
                    <span v-if="item.required" style="color: red; font-weight: bold;">*</span>
                    <span style="font-weight: bold;">{{ item.label }}</span>
                    <DatePicker v-model="item.data" :required="item.required"
                        v-if="item.label === store.form.date.label" />
                    <BaseInput v-model="item.data" :required="item.required" placeholder="Input Text" v-else />
                </div>
            </div>
        </BaseCard>
        <div class="flex gap-3 mx-4 my-8">
            <BaseButton class="flex-grow" outline @click="submitForm">取消</BaseButton>
            <BaseButton class="flex-grow" @click="resetForm">儲存</BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/atoms/BaseCard.vue';
import DatePicker from '../molecules/DatePicker.vue';
import BaseInput from '@/components/atoms/BaseInput.vue'; // 確保 BaseInput 有被導入
import { reactive } from 'vue';
import BaseButton from '../atoms/BaseButton.vue';

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
            required: true
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
