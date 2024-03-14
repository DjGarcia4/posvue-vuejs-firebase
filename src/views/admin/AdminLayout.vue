<template>
  <AdminNav />
  <div class="mt-32 mx-auto container lg:min-h-screen">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import AdminNav from "@/components/AdminNav.vue";
</script>
