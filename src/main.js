import { createApp } from 'vue'
import App from './App.vue'
import store from './store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mitt from "mitt";
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createApolloProvider } from "@vue/apollo-option";
import apolloClient from './apolloClient'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);
const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
})
app.use(apolloProvider);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.config.globalProperties.$EventBus = new mitt();
app.use(store);
app.use(ElementPlus, {locale: zhCn});
app.mount('#app');
