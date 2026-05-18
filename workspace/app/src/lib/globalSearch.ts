import { ref } from "vue";

export const globalSearchOpen = ref(false);

export const openGlobalSearch = () => {
    globalSearchOpen.value = true;
};
