import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import Layout from "#writing/theme/Layout.vue";
import "#writing/theme/style.css";

// Extend the default theme (keeps markdown/prose CSS, code highlighting and the
// local-search wiring) but swap in a custom Layout that reproduces the
// gocanto.sh landing chrome exactly. See Layout.vue and style.css.
const theme: Theme = {
    extends: DefaultTheme,
    Layout,
};

export default theme;
