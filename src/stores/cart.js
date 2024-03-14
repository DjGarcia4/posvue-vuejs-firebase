import { ref, computed, watchEffect } from "vue";
import { defineStore } from "pinia";
import { collection, addDoc, runTransaction, doc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { getCurrentDate } from "@/helpers";
import { useCouponStore } from "./coupons";
export const useCartStore = defineStore("cart", () => {
  const coupon = useCouponStore();
  const db = useFirestore();
  const MAX_PRODUCT = 5;
  const TAX_RATE = 0.15;
  const items = ref([]);
  const subtotal = ref(0);
  const taxes = ref(0);
  const total = ref(0);

  watchEffect(() => {
    subtotal.value = items.value.reduce(
      (accumulator, item) => accumulator + item.quantity * item.price,
      0
    );
    taxes.value = Number((subtotal.value * TAX_RATE).toFixed(2));
    total.value = Number(
      (subtotal.value + taxes.value - coupon.discount).toFixed(2)
    );
  });

  function addItem(item) {
    const index = isItemInCart(item.id);
    if (index >= 0) {
      if (isProductAvailable(item, index)) {
        alert(" You have reached the limit for this product!");
        return;
      }
      items.value[index].quantity++;
    } else {
      items.value.push({ ...item, quantity: 1, id: item.id });
    }
  }

  function updateQuantity(id, quantity) {
    items.value = items.value.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
  }

  function removeItem(id) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  async function checkout() {
    try {
      await addDoc(collection(db, "sales"), {
        items: items.value.map((item) => {
          const { availability, category, ...data } = item;
          return data;
        }),
        subtotal: subtotal.value,
        taxes: taxes.value,
        discount: coupon.discount,
        total: total.value,
        date: getCurrentDate(),
      });
      //Sustraer la cantidad de lo disponible
      items.value.forEach(async (item) => {
        const productRef = doc(db, "products", item.id);
        await runTransaction(db, async (transaction) => {
          const currentProduct = await transaction.get(productRef);
          const availability =
            currentProduct.data().availability - item.quantity;
          transaction.update(productRef, { availability });
        });
      });

      //Reset  cart after purchase
      $reset();
      coupon.$reset();
    } catch (error) {
      console.log(error);
    }
  }

  const isItemInCart = (id) => items.value.findIndex((item) => item.id === id);

  const isProductAvailable = (item, index) => {
    return (
      items.value[index].quantity >= item.availability ||
      items.value[index].quantity >= MAX_PRODUCT
    );
  };

  const isCartEmpty = computed(() => items.value.length === 0);

  const checkProductAvailability = computed(() => {
    return (product) =>
      product.availability > MAX_PRODUCT ? MAX_PRODUCT : product.availability;
  });

  function $reset() {
    items.value = [];
    subtotal.value = 0;
    taxes.value = 0;
    total.value = 0;
  }
  return {
    items,
    isCartEmpty,
    checkProductAvailability,
    subtotal,
    taxes,
    total,
    addItem,
    updateQuantity,
    removeItem,
    checkout,
  };
});
