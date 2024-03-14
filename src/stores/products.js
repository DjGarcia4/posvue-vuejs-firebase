import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import {
  collection,
  addDoc,
  where,
  orderBy,
  limit,
  query,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const useProductsStore = defineStore("products", () => {
  const db = useFirestore();
  const storage = useFirebaseStorage();
  //Mostrar productos de forma desencente

  const q = query(collection(db, "products"), orderBy("availability", "asc"));
  const producstCollection = useCollection(q);
  const selectedCategory = ref(1);
  const categories = [
    { id: 1, name: "Sweatshirts" },
    { id: 2, name: "Sneakers" },
    { id: 3, name: "Glasses" },
  ];

  async function createProduct(product) {
    await addDoc(collection(db, "products"), product);
  }
  const categoryOptions = computed(() => {
    const options = [
      { label: "Select a category", value: "", attrs: { disabled: true } },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ];
    return options;
  });
  async function updateProduct(docRef, product) {
    const { image, url, ...values } = product;
    if (image.length) {
      await updateDoc(docRef, { ...values, image: url.value });
    } else {
      await updateDoc(docRef, values);
    }
  }

  async function deleteProduct(id) {
    if (
      confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      const product = docSnap.data();
      const { image } = product;
      const imageRef = storageRef(storage, image);

      await Promise.all([deleteDoc(docRef), deleteObject(imageRef)]);
    }
  }
  const noResults = computed(() => producstCollection.value.length === 0);
  const filteredProduct = computed(() => {
    return producstCollection.value
      .filter((p) => p.category === selectedCategory.value)
      .filter((p) => p.availability > 0);
  });
  return {
    categoryOptions,
    noResults,
    producstCollection,
    filteredProduct,
    categories,
    selectedCategory,
    createProduct,
    updateProduct,
    deleteProduct,
  };
});
