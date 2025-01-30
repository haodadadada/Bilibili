import { createApp } from 'vue';
import PlayerApp from './player_views/index.vue';
import store from './store/index';
import 'element-plus/dist/index.css';
import '@/common/css/index/index.scss';
import '@/common/css/font/font.css';
import '@/common/css/fixed/index.scss';
import '@/common/css/fixed/map.scss';
import '@/common/css/fixed/light.scss';
import ratio from '@/plugins/directive/ratio/index';
import lazyload from '@/plugins/directive/lazyload/index';
const app = createApp(PlayerApp);
app.directive('ratio', {
    ...ratio
});
app.directive('lazyload', {
    ...lazyload
});
app.use(store).mount('#player');