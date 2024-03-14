<template>
  <div>
    <p v-if="cart.isCartEmpty" class="text-xl text-center text-gray-900">
      Your cart is empty.
    </p>
    <div v-else>
      <p class="text-4xl font-bold text-gray-900">Sale Summary</p>
      <ul role="list" class="mt-6 divide-y divide-gray-200">
        <ShoppingCartItem
          v-for="item in cart.items"
          :key="item.id"
          :item="item"
        />
      </ul>
      <dl
        class="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-500"
      >
        <Amount>
          <template #label>Subtotal:</template>
          {{ formatCurrency(cart.subtotal) }}
        </Amount>
        <Amount>
          <template #label>Taxes:</template>
          {{ formatCurrency(cart.taxes) }}
        </Amount>
        <Amount v-if="coupon.isValidCoupon">
          <template #label>Discount:</template>
          {{ formatCurrency(coupon.discount) }}
        </Amount>
        <Amount>
          <template #label>Total:</template>
          {{ formatCurrency(cart.total) }}
        </Amount>
      </dl>
      <CouponForm />
      <button
        type="button"
        class="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bold p-3 w-full"
        @click="cart.checkout"
      >
        Confirm Purchase
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";
import ShoppingCartItem from "./ShoppingCartItem.vue";
import CouponForm from "./CouponForm.vue";
import Amount from "./Amount.vue";
import { formatCurrency } from "@/helpers";
import { useCouponStore } from "@/stores/coupons";

const cart = useCartStore();
const coupon = useCouponStore();
</script>
