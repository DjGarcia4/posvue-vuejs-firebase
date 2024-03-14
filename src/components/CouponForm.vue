<template>
  <p class="mt-5 py-5 font-bold border-t border-gray-200">
    Do you have a coupon?
  </p>
  <div class="flex">
    <input
      type="text"
      placeholder="Enter a coupon..."
      class="p-2 bg-white border-gray-300 w-full"
      v-model="coupon.couponInput"
      :disabled="coupon.isValidCoupon"
    />
    <button
      type="button"
      class="p-3 bg-green-400 font-bold disabled:opacity-30"
      @click="coupon.applyCoupon"
      :disabled="coupon.isValidCoupon"
    >
      Apply
    </button>
  </div>
  <p class="py-2 text-sm font-extrabold text-center">
    {{ coupon.couponValidationMessage }}
  </p>
</template>

<script setup>
import { useCouponStore } from "@/stores/coupons";
const coupon = useCouponStore();
</script>
