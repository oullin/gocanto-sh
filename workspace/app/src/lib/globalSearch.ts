import { ref, type Ref } from "vue";

const open = ref(false);

/** Provides the shared global-search visibility state and opening action. */
export function useGlobalSearch(): { open: Ref<boolean>; openSearch(): void } {
    const openSearch = () => {
        open.value = true;
    };

    return { open, openSearch };
}
