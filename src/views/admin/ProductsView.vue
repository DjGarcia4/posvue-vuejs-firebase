<template>
  <div class="">
    <Link to="new-product">New Product</Link>
    <h1 class="text-4xl font-bold mt-10">Products</h1>
    <p v-if="products.noResults">There is not any product yet.</p>
    <ul
      v-else
      role="list"
      class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5"
    >
      <Product
        v-for="product in products.producstCollection"
        :key="product.id"
        :product="product"
      />
    </ul>
  </div>
</template>

<script setup>
import Link from "@/components/Link.vue";
import Product from "@/components/Product.vue";
import { useProductsStore } from "@/stores/products";
const products = useProductsStore();
</script>
