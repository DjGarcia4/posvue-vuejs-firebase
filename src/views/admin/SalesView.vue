<template>
  <div>
    <h1 class="text-4xl font-bold mt-10">Sales Summary</h1>
    <div class="md:flex md:items-start gap-5">
      <div class="md:w-1/2 lg:w-1/3 bg-white flex justify-center p-5">
        <VueTailwindDatePicker
          as-single="true"
          no-input
          v-model="sales.date"
          :formatter="formatter"
        />
      </div>
      <div
        class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p-5 pb-32"
      >
        <p class="text-center text-lg" v-if="sales.isDateSelected">
          Date Sales: <span class="font-bold">{{ sales.date }}</span>
        </p>
        <p class="text-center text-lg" v-else>Select a Date</p>
        <div class="space-y-5" v-if="sales.salesCollection.length">
          <p class="text-right text-2xl">
            Total of Day:
            <span class="font-black">
              {{ formatCurrency(sales.totalSalesOfDay) }}</span
            >
          </p>
          <SaleDetails
            v-for="sale in sales.salesCollection"
            :key="sale.id"
            :sale="sale"
          />
        </div>
        <p v-else-if="sales.noSales" class="text-lg text-center">
          There are not sales in this day.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import VueTailwindDatePicker from "vue-tailwind-datepicker";
import { useSalesStore } from "@/stores/sales";
import SaleDetails from "@/components/SaleDetails.vue";
import { formatCurrency } from "@/helpers";

const sales = useSalesStore();
const formatter = ref({ date: "DD/MM/YYYY", month: "MMMM" });
</script>
