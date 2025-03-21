import { createApp } from 'vue';
import LoginApp from './login_views/index.vue';
import store from './store/index';
import 'element-plus/dist/index.css';
import '@/common/css/index/index.scss';
import '@/common/css/font/font.css';
import '@/common/css/fixed/index.scss';
import '@/common/css/fixed/map.scss';
import '@/common/css/fixed/light.scss';
import '@/Tailwind.css';
const app = createApp(LoginApp);
app.use(store).mount('#login');