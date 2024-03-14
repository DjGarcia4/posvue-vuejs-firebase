import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { useCartStore } from "./cart";

export const useCouponStore = defineStore("coupon", () => {
  const cart = useCartStore();
  const couponInput = ref("");
  const couponValidationMessage = ref("");
  const discountPercentage = ref(0);
  const discount = ref(0);

  const VALID_COUPON = [
    { name: "10DISCOUNT", discount: 0.1 },
    { name: "20DISCOUNT", discount: 0.2 },
  ];
  watch(discountPercentage, () => {
    discount.value = (cart.total * discountPercentage.value).toFixed(2);
  });

  function applyCoupon() {
    //we verofy  if the input is empty or not
    if (couponInput.value === "") {
      couponValidationMessage.value = "Please enter a valid coupon code.";
      return;
    }

    //We verify if the coupon exist or not
    if (VALID_COUPON.some((coupon) => coupon.name === couponInput.value)) {
      couponValidationMessage.value = "Appliying...";
      setTimeout(() => {
        discountPercentage.value = VALID_COUPON.find(
          (coupon) => coupon.name === couponInput.value
        ).discount;
        couponValidationMessage.value = "Your coupon has been applied!";
      }, 3000);
    } else {
      couponValidationMessage.value = "Invalid Coupon! Please try again.";
    }
    setTimeout(() => {
      couponValidationMessage.value = "";
    }, 6000);
  }
  function $reset() {
    couponInput.value = "";
    couponValidationMessage.value = "";
    discountPercentage.value = 0;
    discount.value = 0;
  }
  const isValidCoupon = computed(() => discountPercentage.value > 0);
  return {
    couponInput,
    couponValidationMessage,
    discount,
    isValidCoupon,
    applyCoupon,
    $reset,
  };
});
