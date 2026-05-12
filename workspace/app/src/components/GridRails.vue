<template>
  <div
    class="pointer-events-none absolute left-0 right-0 top-0 z-[3] border-t border-border max-mid:hidden"
    aria-hidden="true"
  >
    <span class="cross-mark absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-fg-3"></span>
    <span class="cross-mark absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-fg-3"></span>
  </div>
  <div
    class="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[60] w-[min(100%,var(--container-page))] -translate-x-1/2 border-x border-t border-border max-mid:hidden"
    aria-hidden="true"
  ></div>
</template>
