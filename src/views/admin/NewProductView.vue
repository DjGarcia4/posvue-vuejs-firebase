<template>
  <div>
    <Link to="products">Return</Link>
    <h1 class="text-4xl font-bold my-10">New Product</h1>
    <div class="flex justify-center bg-white shadow rounded-md">
      <div class="mt-10 p-10 w-full 2xl:w-2/4">
        <FormKit
          type="form"
          submit-label="Add Product"
          @submit="submitHandler"
          :value="formData"
        >
          <FormKit
            type="text"
            label="Product Name"
            name="name"
            placeholder="Name of the product"
            validation="required"
            v-model.trim="formData.name"
          />
          <FormKit
            type="file"
            label="Product Image"
            name="image"
            validation="required"
            accept=".jpg"
            @change="onFileChange"
            v-model.trim="formData.image"
          />
          <div v-if="isImageUpload">
            <p class="font-black">Product Image:</p>
            <img :src="url" alt="New Product Image" class="w-32" />
          </div>
          <FormKit
            type="select"
            label="Product Category"
            name="category"
            validation="required"
            :options="products.categoryOptions"
            v-model.number="formData.category"
          />
          <FormKit
            type="number"
            label="Product Price"
            name="price"
            validation="required"
            placeholder="Price of the product"
            min="1"
            v-model.number="formData.price"
          />
          <FormKit
            type="number"
            label="Product Stock"
            name="availability"
            validation="required"
            placeholder="Stock of the product"
            step="1"
            min="0"
            v-model.number="formData.availability"
          />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import Link from "@/components/Link.vue";
import useImage from "../../composables/useImage";
import { useProductsStore } from "../../stores/products";

const { onFileChange, url, isImageUpload } = useImage();
const products = useProductsStore();
const router = useRouter();

const formData = reactive({
  name: "",
  category: "",
  price: "",
  availability: "",
  image: "",
});

const submitHandler = async (data) => {
  const { image, ...values } = data;
  try {
    await products.createProduct({ ...values, image: url.value });
    router.push({ name: "products" });
  } catch (error) {
    console.log(error);
  }
};
</script>
